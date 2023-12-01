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

  on_click?: () => void,
  on_rollover?: () => void,
  on_rollout?: () => void,
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

    this.initChildren(children, options.alignChildren, options.padding || 0, options.childrenSpacing);

    if (options.background) {
      this.initBackground(options.background);
    }

    if (options.on_click || options.on_rollout || options.on_rollover) {
      const hitArea = new Shape();
      hitArea.graphics.beginFill('#000').drawRect(0, 0, this.getSize().width, this.getSize().height);
      this.renderObject.hitArea = hitArea;
    }

    options.on_click && this.renderObject.on('click', options.on_click);
    options.on_rollout && this.renderObject.on('rollout', options.on_rollout);
    options.on_rollover && this.renderObject.on('rollover', options.on_rollover);

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
    childrenSpacing: number | null
  ): void {
    childrenSpacing = null == childrenSpacing ? this.ELEMENTS_PADDING : childrenSpacing;
    const childrenHeight = children.reduce((acc, child) => acc + child.getSize().height, 0)
      + childrenSpacing * (children.length - 1);

    let offset = 0;
    children
      .filter((child) => !child.hasPosition())
      .forEach((child) => {
        const childOffsetX = !child.getPosition()?.x 
          ? alignChildren?.horizontal
            ? Math.max(
                alignChildren?.horizontal === 'center'
                  ? (this.getSize().width - child.getSize().width) / 2
                  : 0,
                0
              ) + padding
            : 0
          : null;

        const childOffsetY = !child.getPosition()?.y 
          ? alignChildren?.vertical
            ? (alignChildren?.vertical === 'middle'
              ? (this.getSize().height - childrenHeight) / 2
              : 0) + offset + padding
            : 0
          : null;

        child.addToStage(this.renderObject, {x: childOffsetX, y: childOffsetY});
        offset += child.getSize().height + childrenSpacing;
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
        0, 
        0, 
        this.renderObject.getBounds()?.width, 
        this.renderObject.getBounds()?.height
      )
      .endFill();
    this.renderObject.children = [shape, ...this.renderObject.children];
  }
}