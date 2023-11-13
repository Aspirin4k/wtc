import { RenderingContext } from '../helpers/RenderingContext';
import { Renderable } from './RenderableInterface';
import { ExactPosition, Size } from './Interfaces';
import { Element } from './Element';

import type { ElementOptions } from './Element';

type ContainerOptions = ElementOptions & {
  background?: string
}

export class Container extends Element {
  private readonly background?: string;
  private readonly children: Element[];

  constructor(options: ContainerOptions, children: Element[] = []) {
    super(options);
    this.background = options.background;
    this.children = children;
    this.initChildren();
  }

  protected onClickElement(position: ExactPosition) {
    if (this.onClickContainer()) {
      return true;
    }

    const offsetPosition = {
      x: position.x - this.getPosition().x,
      y: position.y - this.getPosition().y
    }
    for (const child of this.children) {
      if (child.onClick(offsetPosition)) {
        return true;
      }
    }

    return false;
  }

  protected onClickContainer(): boolean {
    return false;
  }

  protected renderElement(context: RenderingContext): void {
    this.renderContainer(context);
    this.children.forEach(
      (child: Element) => child.render(context.withOffset(this.getPosition()))
    );
  }

  protected renderContainer(context: RenderingContext): void {
    if (this.background) {
      context.rectangle(this.position, this.size, this.background);
    }
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
      }, 0)
    }

    return this.size;
  }

  setPosition(position: ExactPosition): void {
      super.setPosition(position);
      this.initChildren();
  }

  private initChildren(): void {
    if (!this.position) {
      return;
    }

    const floating_children = this.children.filter((child) => !child.isExactPosition());
    if (floating_children.length) {
      const first = floating_children[0];
      this.initAlignmentChildOffset(first);
      floating_children.forEach((child, index) => {
        if (index === 0) {
          return;
        }

        child.setPosition({
          x: first.getPosition().x,
          y: first.getPosition().y + floating_children[index - 1].getSize().height + 10,
        })
      })
    }
  }

  private initAlignmentChildOffset(child: Element): void {
    let offset = {
      x: child.getPosition().x || 0,
      y: child.getPosition().y || 0,
    }

    switch (child.getAutoPosition().horizontal) {
      case 'center':
        offset.x += (this.getSize().width - child.getSize().width) / 2;
        break;
    }

    switch (child.getAutoPosition().vertical) {
      case 'middle':
        offset.y += (this.getSize().height - child.getSize().height) / 2;
        break;
    }

    child.setPosition(offset);
  }
}