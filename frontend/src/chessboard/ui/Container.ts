import { Container as CreateJSContainer, Shape } from 'createjs-module';

import { ExactPosition, Size } from './Interfaces';
import { Element } from './Element';

import type { ElementOptions } from './Element';

type AutoPosition = {
  horizontal: 'left' | 'center',
  vertical: 'top' | 'middle',
}

export type ContainerOptions = ElementOptions & {
  alignChildren?: AutoPosition,
  background?: string,
  padding?: number,
}

export class Container extends Element {
  private readonly ELEMENTS_PADDING = 10;

  protected readonly renderObject: CreateJSContainer;

  constructor(options: ContainerOptions, children: Element[] = []) {
    super(options);

    this.renderObject = new CreateJSContainer();
    this.renderObject.name = 'Container';

    if (options.position) {
      this.initPosition(options.position);
    }

    if (options.size) {
      this.initSize(options.size, options.padding || 0);
    }

    this.initChildren(children, options.alignChildren, options.padding || 0);

    if (options.background) {
      this.initBackground(options.background);
    }
  }

  private initPosition(position: ExactPosition): void {
    this.renderObject.x = position.x;
    this.renderObject.y = position.y;
  }

  private initSize(size: Size, padding: number): void {
    // When width and height are both set we can explicitly set
    // boudaries of container
    if (size.width && size.height) {
      this.renderObject.setBounds(
        this.renderObject.x,
        this.renderObject.y,
        size.width,
        size.height
      );
    }

    // When either width or height is set (but not both!)
    // we add invisible object into container, so container
    // will still be able to stretch in one of the directions 
    // if children overflow
    if (!!size.width !== !!size.height) {
      const transparentObject = new Shape();
      transparentObject.name = 'Invisible child';
      transparentObject.setBounds(
        0, 
        0, 
        Math.max(0, size.width - 2 * padding), 
        Math.max(0, size.height - 2 * padding)
      );
      this.renderObject.addChild(transparentObject);
    }
  }

  private initChildren(children: Element[], alignChildren: AutoPosition | null, padding: number): void {
    const childrenHeight = children.reduce((acc, child) => acc + child.getSize().height, 0)
      + this.ELEMENTS_PADDING * (children.length - 1);

    let offset = 0;
    children
      .filter((child) => !child.hasPosition())
      .forEach((child) => {
        const childOffsetX = Math.max(
          alignChildren?.horizontal === 'center'
            ? (this.getSize().width - child.getSize().width) / 2
            : 0,
          0
        );

        const childOffsetY = alignChildren?.vertical === 'middle'
          ? (this.getSize().height - childrenHeight) / 2
          : 0;

        child.addToStage(this.renderObject, {x: childOffsetX + padding, y: childOffsetY + offset + padding});
        offset += child.getSize().height + this.ELEMENTS_PADDING;
      });

    children.filter((child) => child.hasPosition()).forEach((child) => child.addToStage(this.renderObject));

    this.renderObject.setBounds(
      0,
      0,
      this.getSize().width + padding,
      this.getSize().height + padding
    );
  }

  private initBackground(background: string): void {
    const shape = new Shape();
    shape.name = 'Background';
    shape.graphics
      .beginFill(background)
      .drawRect(
        this.renderObject.x, 
        this.renderObject.y, 
        this.renderObject.getBounds()?.width, 
        this.renderObject.getBounds()?.height
      )
      .endFill();
    this.renderObject.children = [shape, ...this.renderObject.children];
  }
}