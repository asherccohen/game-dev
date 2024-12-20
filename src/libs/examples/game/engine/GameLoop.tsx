import React, { Component } from "react";

import DefaultTimer from "./DefaultTimer";

const events = `onClick onContextMenu onDoubleClick onDrag onDragEnd onDragEnter onDragExit onDragLeave onDragOver onDragStart onDrop onMouseDown onMouseEnter onMouseLeave onMouseMove onMouseOut onMouseOver onMouseUp onWheel onTouchCancel onTouchEnd onTouchMove onTouchStart onKeyDown onKeyPress onKeyUp`;

export default class GameLoop extends Component<{
  timer: number;
  running: boolean;
  onUpdate: any;
  className: string;
  style: any;
}> {
  timer: any;
  input: any[];
  previousTime: any;
  previousDelta: any;
  static defaultProps: { running: boolean };
  constructor(props) {
    super(props);
    this.timer = props.timer || new DefaultTimer();
    this.timer.subscribe(this.updateHandler);
    this.input = [];
    this.previousTime = null;
    this.previousDelta = null;
  }

  componentDidMount() {
    if (this.props.running) this.start();
  }

  componentWillUnmount() {
    this.stop();
    this.timer.unsubscribe(this.updateHandler);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.running !== this.props.running) {
      if (nextProps.running) this.start();
      else this.stop();
    }
  }

  start = () => {
    this.input.length = 0;
    this.previousTime = null;
    this.previousDelta = null;
    this.timer.start();
    (this.refs.container as any).focus();
  };

  stop = () => {
    this.timer.stop();
  };

  updateHandler = (currentTime) => {
    const args = {
      input: this.input,
      window: window,
      time: {
        current: currentTime,
        previous: this.previousTime,
        delta: currentTime - (this.previousTime || currentTime),
        previousDelta: this.previousDelta,
      },
    };

    if (this.props.onUpdate) this.props.onUpdate(args);

    this.input.length = 0;
    this.previousTime = currentTime;
    this.previousDelta = args.time.delta;
  };

  inputHandlers = events
    .split(" ")
    .map((name) => ({
      name,
      handler: (payload) => {
        payload.persist();
        this.input.push({ name, payload });
      },
    }))
    .reduce((acc, val) => {
      acc[val.name] = val.handler;
      return acc;
    }, {});

  render() {
    return (
      <div
        ref={"container"}
        style={{ ...css.container, ...this.props.style }}
        className={this.props.className}
        tabIndex={0}
        {...this.inputHandlers}
      >
        {this.props.children}
      </div>
    );
  }
}

GameLoop.defaultProps = {
  running: true,
};

const css = {
  container: {
    flex: 1,
    outline: "none",
  },
};
