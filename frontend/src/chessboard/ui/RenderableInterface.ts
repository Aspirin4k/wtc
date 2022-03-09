import { RenderingContext } from '../helpers/RenderingContext';

export interface Renderable {
  render: (context: RenderingContext) => void,
}