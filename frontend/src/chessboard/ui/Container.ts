import { Container as CreateJSContainer, Shape } from 'createjs-module';

import { ExactPosition, Size } from './Interfaces';
import { Element } from './Element';

import type { ElementOptions } from './Element';

type AutoPosition = {
  horizontal?: 'left' | 'center',
  vertical?: 'top' | 'middle',
}

export type ContainerOptions = ElementOptions & {
  alignChildren?: AutoPosition,
  background?: string,
  backgroundOver?: string,
  padding?: number,
  childrenSpacing?: number,
  childrenDirection?: 'column' | 'row',

  on_click?: (self: Container) => void,
  on_rollover?: (self: Container) => void,
  on_rollout?: (self: Container) => void,
}

export class Container extends Element {
  private readonly ELEMENTS_PADDING = 10;

  protected readonly renderObject: CreateJSContainer;

  private readonly children: Element[];

  constructor(options: ContainerOptions, children: Element[] = []) {
    super(options);

    this.children = children;

    this.renderObject = new CreateJSContainer();
    this.renderObject.name = 'Container';

    if (options.position) {
      this.initPosition(options.position);
    }

    if (options.size) {
      this.initSize(options.size, options.padding || 0);
    }

    this.initChildren(
      children, 
      options.alignChildren, 
      options.padding || 0, 
      options.childrenSpacing, 
      options.childrenDirection || 'column'
    );

    if (options.background) {
      this.initBackground(options.background);
    }

    if (options.on_click || options.on_rollout || options.on_rollover) {
      const hitArea = new Shape();
      hitArea.graphics.beginFill('#000').drawRect(0, 0, this.getSize().width, this.getSize().height);
      this.renderObject.hitArea = hitArea;
    }

    options.on_click && this.renderObject.on('click', () => options.on_click(this));
    options.on_rollout && this.renderObject.on('rollout', () => options.on_rollout(this));
    options.on_rollover && this.renderObject.on('rollover', () => options.on_rollover(this));

    this.initCommon();
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

  private initChildren(
    children: Element[], 
    alignChildren: AutoPosition | null,
    padding: number,
    childrenSpacing: number | null,
    childrenDirection: 'column' | 'row'
  ): void {
    childrenSpacing = null == childrenSpacing ? this.ELEMENTS_PADDING : childrenSpacing;
    const childrenHeight = children.reduce((acc, child) => acc + child.getSize().height, 0)
      + childrenSpacing * (children.length - 1);
    const childrenWidth = children.reduce((acc, child) => acc + child.getSize().width, 0)
      + childrenSpacing * (children.length - 1);

    let offset = 0;
    children
      .filter((child) => !child.hasPosition())
      .forEach((child) => {
        const childOffsetX = this.getChildOffsetX(
          child,
          alignChildren,
          padding,
          childrenDirection,
          childrenWidth,
          offset
        );
        const childOffsetY = this.getChildOffsetY(
          child,
          alignChildren,
          padding,
          childrenDirection,
          childrenHeight,
          offset
        );

        child.addToStage(this.renderObject, {x: childOffsetX, y: childOffsetY});
        offset += (childrenDirection === 'column' ? child.getSize().height : child.getSize().width) + childrenSpacing;
      });

    children.filter((child) => child.hasPosition()).forEach((child) => child.addToStage(this.renderObject));

    this.renderObject.setBounds(
      0,
      0,
      this.getSize().width + padding,
      this.getSize().height + padding
    );
  }

  private getChildOffsetX(
    child: Element, 
    alignChildren: AutoPosition | null,
    padding: number,
    childrenDirection: 'column' | 'row',
    childrenWidth: number,
    currentOffset: number
  ): number {
    if (child.getPosition()?.x) {
      return null;
    }

    if (!alignChildren?.horizontal) {
      return 0;
    }

    const isRowDirection = childrenDirection === 'row';
    let offset = 0;
    if (alignChildren?.horizontal === 'center') {
      offset = Math.max((this.getSize().width - (isRowDirection ? childrenWidth : child.getSize().width)) / 2, 0);
    }

    if (isRowDirection) {
      offset += currentOffset;
    }

    return offset + padding;
  }

  private getChildOffsetY(
    child: Element, 
    alignChildren: AutoPosition | null,
    padding: number,
    childrenDirection: 'column' | 'row',
    childrenHeight: number,
    currentOffset: number
  ): number {
    if (child.getPosition()?.y) {
      return null;
    }

    if (!alignChildren?.vertical) {
      return 0;
    }

    const isColumnDirection = childrenDirection === 'column';
    let offset = 0;
    if (alignChildren?.vertical === 'middle') {
      offset = Math.max((this.getSize().height - (isColumnDirection ? childrenHeight : child.getSize().height)) / 2, 0);
    }

    if (isColumnDirection) {
      offset += currentOffset;
    }

    return offset + padding;
  }

  private initBackground(background: string): void {
    const shape = new Shape();
    shape.name = 'Background';
    shape.graphics
      .beginFill(background)
      .drawRect(
        0, 
        0, 
        this.renderObject.getBounds()?.width, 
        this.renderObject.getBounds()?.height
      )
      .endFill();
    this.renderObject.children = [shape, ...this.renderObject.children];
  }

  public getChildren(): Element[] {
    return this.children;
  }
}