import { RenderingContext } from '../helpers/RenderingContext';
import { Renderable } from './RenderableInterface';
import { ExactPosition, Size } from './Interfaces';
import { Element } from './Element';

import type { ElementOptions } from './Element';

export class Container extends Element {
  private readonly children: Element[];

  constructor(canvas: HTMLCanvasElement, options: ElementOptions, children: Element[] = []) {
    super(canvas, options);
    this.children = children;
    this.initChildren();
  }

  protected onClickContainer(): boolean {
    return false;
  }

  protected renderContainer(context: RenderingContext): void {
  }

  getSize(): Size {
    if (!this.size || !this.size.height) {
      if (!this.size) {
        this.size = {};
      }

      this.size.height = this.children.reduce((acc, child) => {
        if (!child.isExactPosition()) {
          acc += child.getSize().height + 10;
        }
        return acc;
      }, 10)
    }

    return this.size;
  }

  setOffset(position: ExactPosition) {
    if (position.y === 0 && position.x === 0) {
      return;
    }

    super.setOffset(position);
    this.initChildren();
  }

  protected onClickElement(position: ExactPosition) {
    if (this.onClickContainer()) {
      return true;
    }

    for (const child of this.children) {
      if (child.onClick(position)) {
        return true;
      }
    }

    return false;
  }

  protected renderElement(context: RenderingContext): void {
    this.renderContainer(context);
    this.children.forEach((child: Renderable) => child.render(context));
  }

  private initChildren(): void {
    if (!this.position) {
      return;
    }

    const exact_children = this.children.filter((child) => child.isExactPosition());
    exact_children.forEach((child) => child.setOffset(this.position));

    const floating_children = this.children.filter((child) => !child.isExactPosition());
    if (floating_children.length) {
      const first = floating_children[floating_children.length - 1];
      this.initAlignmentChildOffset(first);
      floating_children.forEach((child, index) => {
        if (index === 0) {
          return;
        }

        child.setOffset({
          x: 0,
          y: floating_children[index - 1].getSize().height + 10,
        })
      })
    }
  }

  private initAlignmentChildOffset(child: Element): void {
    let offset = {
      x: this.getPosition().x,
      y: this.getPosition().y,
    }

    switch (child.getAutoPosition().horizontal) {
      case 'center':
        offset.x += (this.getSize().width - child.getSize().width) / 2;
        break;
    }

    switch (child.getAutoPosition().vertical) {
      case 'middle':
        offset.y += (this.getSize().height - child.getSize().height) / 2 - 10;
        break;
    }

    child.setOffset(offset);
  }
}