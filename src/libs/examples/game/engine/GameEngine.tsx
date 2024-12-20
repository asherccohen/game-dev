import React, { Component } from "react";

import DefaultRenderer from "./DefaultRenderer";
import DefaultTimer from "./DefaultTimer";

const getEntitiesFromProps = (props) =>
  props.initState ||
  props.initialState ||
  props.state ||
  props.initEntities ||
  props.initialEntities ||
  props.entities;

const isPromise = (obj) => {
  return !!(
    obj &&
    obj.then &&
    obj.then.constructor &&
    obj.then.call &&
    obj.then.apply
  );
};

const events = `onClick onContextMenu onDoubleClick onDrag onDragEnd onDragEnter onDragExit onDragLeave onDragOver onDragStart onDrop onMouseDown onMouseEnter onMouseLeave onMouseMove onMouseOut onMouseOver onMouseUp onWheel onTouchCancel onTouchEnd onTouchMove onTouchStart onKeyDown onKeyPress onKeyUp`;

export default class GameEngine extends Component<
  {
    systems: any;
    running: boolean;
    onEvent: any;
    className: string;
    style: any;
    renderer: any;
  },
  { entities: any }
> {
  timer: any;
  input: any[];
  previousTime: any;
  previousDelta: any;
  events: any[];
  static defaultProps: {
    systems: any[];
    entities: Record<string, unknown>;
    renderer: (entities: any, window: any) => JSX.Element[];
    running: boolean;
  };
  constructor(props) {
    super(props);
    this.state = {
      entities: null,
    };
    this.timer = props.timer || new DefaultTimer();
    this.timer.subscribe(this.updateHandler);
    this.input = [];
    this.previousTime = null;
    this.previousDelta = null;
    this.events = [];
  }

  async componentDidMount() {
    let entities = getEntitiesFromProps(this.props);

    if (isPromise(entities)) entities = await entities;

    this.setState(
      {
        entities: entities || {},
      },
      () => {
        if (this.props.running) this.start();
      }
    );
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

  clear = () => {
    this.input.length = 0;
    this.events.length = 0;
    this.previousTime = null;
    this.previousDelta = null;
  };

  start = () => {
    this.clear();
    this.timer.start();
    this.dispatch({ type: "started" });
    (this.refs.container as any).focus();
  };

  stop = () => {
    this.timer.stop();
    this.dispatch({ type: "stopped" });
  };

  swap = async (newEntities) => {
    if (isPromise(newEntities)) newEntities = await newEntities;

    this.setState({ entities: newEntities || {} }, () => {
      this.clear();
      this.dispatch({ type: "swapped" });
    });
  };

  defer = (e) => {
    this.dispatch(e);
  };

  dispatch = (e) => {
    setTimeout(() => {
      this.events.push(e);
      if (this.props.onEvent) this.props.onEvent(e);
    }, 0);
  };

  updateHandler = (currentTime) => {
    const args = {
      input: this.input,
      window: window,
      events: this.events,
      dispatch: this.dispatch,
      defer: this.defer,
      time: {
        current: currentTime,
        previous: this.previousTime,
        delta: currentTime - (this.previousTime || currentTime),
        previousDelta: this.previousDelta,
      },
    };

    const newState = this.props.systems.reduce(
      (state, sys) => sys(state, args),
      this.state.entities
    );

    this.input.length = 0;
    this.events.length = 0;
    this.previousTime = currentTime;
    this.previousDelta = args.time.delta;
    this.setState({ entities: newState });
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
        {this.props.renderer(this.state.entities, window)}
        {this.props.children}
      </div>
    );
  }
}

GameEngine.defaultProps = {
  systems: [],
  entities: {},
  renderer: DefaultRenderer,
  running: true,
};

const css = {
  container: {
    flex: 1,
    outline: "none",
  },
};
