import '@babel/polyfill';
import './style.less';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Route, Switch } from 'react-router';
import * as VConsole from 'vconsole';

import { BrowserRouter } from 'react-router-dom';
import { Config } from 'Constants/config';

import App from './app';

if (process.env.NODE_ENV !== 'prod') {
  const vconsole = new (VConsole as any)();
}

ReactDOM.render(
  (
    <BrowserRouter basename={`${Config.pageRoot}/qrcode`}>
        <Switch>
          <Route path="/:id" component={App} />
        </Switch>
    </BrowserRouter>
  ),
  document.getElementById('root'));
