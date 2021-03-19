import { Props, State, ImageInfo } from './types';

import * as React from 'react';
import Helmet from 'react-helmet';
import { getMethod } from 'Service';
import { Toast } from 'antd-mobile';
import { Config } from 'Constants/config';

import './style.less';

export default class ImageContainer extends React.Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {
      imageInfo: null,
      hasSetWxShare: false,
    };
  }

  public componentDidMount() {
    Toast.loading('');
    if (!this.props.match.params.id) Toast.fail('缺少图片id，加载失败');
    else {
      getMethod<ImageInfo>(`${Config.serverRoot}/qrcode/random/${this.props.match.params.id}`).then(res => {
        this.setState({imageInfo: res.data});
        Toast.loading('');
      });
    }
  }

  public render(): React.ReactChild {
    if (!this.state.imageInfo) return <React.Fragment />;
    return (
      <React.Fragment>
        <Helmet>
          <title>{this.state.imageInfo.name}</title>
        </Helmet>
        <img className="image-container" src={`${Config.staticPath}${this.state.imageInfo.file.name}`} alt={this.state.imageInfo.name}/>
      </React.Fragment>
    );
  }
}
