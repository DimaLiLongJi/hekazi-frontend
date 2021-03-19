import * as React from "react";
import { Route, Switch } from "react-router-dom";

import ImageContainer from "./container/image-container";

export interface Props extends Typings.RouteProps<any, any> {}
export interface State {}

export default class App extends React.Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
  }

  public render(): React.ReactChild {
    // 自行创建路由
    return (
      <React.Fragment>
        <Switch>
          <Route path="/:id" component={ImageContainer} />
        </Switch>
      </React.Fragment>
    );
  }
}
