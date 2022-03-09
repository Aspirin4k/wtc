import { RenderingContext } from '../helpers/RenderingContext';
import { Container } from './Container';

export class SimpleWindow extends Container {
    public renderContainer(context: RenderingContext): void {
        this.background(context, 'green');
    }
}
