import {
  ExcalidrawElement,
  NonDeleted,
} from '@excalidraw/excalidraw/types/element/types';
import { AppState, BinaryFiles } from '@excalidraw/excalidraw/types/types';
import { useEffect, useState } from 'react';
import { exportToSvg } from '@excalidraw/excalidraw';

type ImageType = 'svg' | 'canvas';

type Dimension = 'inherit' | number;

type Props = {
  appState: AppState;

  className?: string;

  elements: NonDeleted<ExcalidrawElement>[];

  files: BinaryFiles;

  height?: Dimension;

  imageContainerRef: React.MutableRefObject<HTMLDivElement | null>;

  imageType?: ImageType;

  rootClassName?: string | null;

  width?: Dimension;
};

const removeStyleFromSvg_HACK = (svg: SVGElement) => {
  const styleTag = svg?.firstElementChild?.firstElementChild;

  const viewBox = svg.getAttribute('viewBox');
  if (viewBox != null) {
    const viewBoxDimensions = viewBox.split(' ');
    svg.setAttribute('width', viewBoxDimensions[2] ?? 'inherit');
    svg.setAttribute('height', viewBoxDimensions[3] ?? 'inherit');
  }

  if (styleTag && styleTag.tagName === 'style') {
    styleTag.remove();
  }
};

const ExcalidrawImage= ({
  elements,
  files,
  imageContainerRef,
  appState,
  rootClassName = null,
  width = 'inherit',
  height = 'inherit',
}: Props): JSX.Element => {
  const [Svg, setSvg] = useState<SVGElement | null>(null);

  useEffect(() => {
    const setContent = async () => {
      const svg: SVGElement = await exportToSvg({
        appState,
        elements,
        files,
      });
      removeStyleFromSvg_HACK(svg);

      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      svg.setAttribute('display', 'block');

      setSvg(svg);
    };
    setContent();
  }, [elements, files, appState]);

  const containerStyle: React.CSSProperties = {};
  if (width !== 'inherit') {
    containerStyle.width = `${width}px`;
  }
  if (height !== 'inherit') {
    containerStyle.height = `${height}px`;
  }

  return (
    <div
      ref={(node) => {
        if (node) {
          if (imageContainerRef) {
            imageContainerRef.current = node;
          }
        }
      }}
      className={rootClassName ?? ''}
      style={containerStyle}
      dangerouslySetInnerHTML={{ __html: Svg?.outerHTML ?? '' }}
    />
  );
}

export default ExcalidrawImage;