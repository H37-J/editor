import { validateUrl } from '@/editor/utils/url';
import {LinkPlugin as LexicalLinkPlugin} from '@lexical/react/LexicalLinkPlugin';
export default function LinkPlugin(): JSX.Element {
  return <LexicalLinkPlugin validateUrl={validateUrl} />;
}
