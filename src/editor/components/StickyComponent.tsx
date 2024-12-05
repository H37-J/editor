import { $getNodeByKey, LexicalEditor, NodeKey } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { calculateZoomLevel } from '@lexical/utils';
import { $isStickyNode } from '@/editor/nodes/StickyNode';
import { LexicalNestedComposer } from '@lexical/react/LexicalNestedComposer';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import StickyTheme from '@/editor/theme/StickyTheme';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';

type Positioning = {
  isDragging: boolean;
  offsetX: number;
  offsetY: number;
  rootElementRect: null | ClientRect;
  x: number;
  y: number;
};

const positionSticky = (
  stickyElem: HTMLElement,
  positioning: Positioning
): void => {
  const style = stickyElem.style;
  const rootElementRect = positioning.rootElementRect;
  const rectLeft = rootElementRect !== null ? rootElementRect.left : 0;
  const rectTop = rootElementRect !== null ? rootElementRect.top : 0;
  style.top = rectTop + positioning.y + 'px';
  style.left = rectLeft + positioning.x + 'px';
};

export const StickyComponent = ({
  x,
  y,
  nodeKey,
  color,
  caption,
}: {
  caption: LexicalEditor;
  color: 'pink' | 'yellow';
  nodeKey: NodeKey;
  x: number;
  y: number;
}): JSX.Element => {
  const [editor] = useLexicalComposerContext();
  const stickyContainerRef = useRef<HTMLDivElement | null>(null);
  const positioningRef = useRef<Positioning>({
    isDragging: false,
    offsetX: 0,
    offsetY: 0,
    rootElementRect: null,
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const position = positioningRef.current;
    position.x = x;
    position.y = y;

    const stickContainer = stickyContainerRef.current;
    if (stickContainer !== null) {
      positionSticky(stickContainer, position);
    }
  }, [x, y]);

  useLayoutEffect(() => {
    const position = positioningRef.current;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        // @ts-ignore
        const { target } = entry;
        position.rootElementRect = target.getBoundingClientRect();
        const stickyContainer = stickyContainerRef.current;
        if (stickyContainer !== null) {
          positionSticky(stickyContainer, position);
        }
      }
    });

    const removeRootListener = editor.registerRootListener(
      (nextRootElem, prevRootElem) => {
        if (prevRootElem !== null) {
          resizeObserver.unobserve(prevRootElem);
        }
        if (nextRootElem !== null) {
          resizeObserver.observe(nextRootElem);
        }
      }
    );

    const handleWindowResize = () => {
      const rootElement = editor.getRootElement();
      const stickyContainer = stickyContainerRef.current;
      if (rootElement !== null && stickyContainer !== null) {
        position.rootElementRect = rootElement.getBoundingClientRect();
        positionSticky(stickyContainer, position);
      }
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
      removeRootListener();
    };
  }, [editor]);

  useEffect(() => {
    const stickyContainer = stickyContainerRef.current;
    if (stickyContainer !== null) {
      setTimeout(() => {
        stickyContainer.style.setProperty(
          'transition',
          'top 0.3s ease 0s, left 0.3s ease 0s'
        );
      }, 500);
    }
  }, []);

  const handlePointerMove = (event: PointerEvent) => {
    const stickyContainer = stickyContainerRef.current;
    const positioning = positioningRef.current;
    const rootElementRect = positioning.rootElementRect;
    const zoom = calculateZoomLevel(stickyContainer);
    if (
      stickyContainer !== null &&
      rootElementRect !== null &&
      positioning.isDragging
    ) {
      positioning.x =
        event.pageX / zoom - positioning.offsetX - rootElementRect.left;
      positioning.y =
        event.pageY / zoom - positioning.offsetY - rootElementRect.top;
      positionSticky(stickyContainer, positioning);
    }
  };

  const handlePointerDown = (event) => {
    const stickyContainer = stickyContainerRef.current;
    if (
      stickyContainer === null ||
      event.button === 2 ||
      event.target !== stickyContainer.firstChild
    ) {
      return;
    }
    const positioning = positioningRef.current;
    const { top, left } = stickyContainer.getBoundingClientRect();
    const zoom = calculateZoomLevel(stickyContainer);
    positioning.offsetX = event.pageX / zoom - left;
    positioning.offsetY = event.pageY / zoom - top;
    positioning.isDragging = true;
    stickyContainer.classList.add('dragging');
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
    event.preventDefault();
  };

  const handlePointerUp = (event: PointerEvent) => {
    const stickyContainer = stickyContainerRef.current;
    const positioning = positioningRef.current;
    if (stickyContainer !== null) {
      positioning.isDragging = false;
      stickyContainer.classList.remove('dragging');
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if ($isStickyNode(node)) {
          node.setPosition(positioning.x, positioning.y);
        }
      });
    }
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerup', handlePointerUp);
  };

  const handleDelete = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isStickyNode(node)) {
        node.remove();
      }
    })
  };

  const handleColorChange = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isStickyNode(node)) {
        node.toggleColor();
      }
    });
  };

  return (
    <div ref={stickyContainerRef} className="sticky-note-container">
      <div
        className={`sticky-note ${color}`}
        onPointerDown={handlePointerDown}
      >
        <button className="delete"
                onClick={handleDelete}
                title="Delete"
                aria-label="Delete Sticky Note">
          X
        </button>
        <button
          onClick={handleColorChange}
          className="color"
          aria-label="Change sticky note color"
          title="Color">
          <i className="icon format paint" />
        </button>
        <LexicalNestedComposer
          initialEditor={caption}
          initialTheme={StickyTheme}>
          <PlainTextPlugin
            contentEditable={
              <ContentEditable
                aria-placeholder={'메모해 보세요'}
                placeholder={<div className="StickyNode__placeholder">메모해 보세요</div>}
                className="StickyNode__contentEditable"
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </LexicalNestedComposer>
      </div>
    </div>
  );
};

export default StickyComponent;
