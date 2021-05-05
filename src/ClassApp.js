import React, { Component } from 'react';

class ClassApp extends Component {
  constructor(props){
    super(props)
    this.state ={
      test:'test'
    };
  }

  testFun(){
    this.setState({test:'test'})
  }
  testFun2(){
    this.testFun()
 
  }

  render() {
    this.testFun2()
    const { color, name, isSpecial } = this.props;
    return (
      <div style={{ color }}>
        {isSpecial && <b>*</b>}
        {this.state.test} {name}
      </div>
    );
  }
}

ClassApp.defaultProps = {
  name: '이름없음'
};

export default ClassApp;