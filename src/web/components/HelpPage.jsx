import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import ColorBackground from './Backgrounds/ColorBackground';
import TitleBar from './UI/TitleBar';
import RoutedBackButton from './RoutedBackButton';
import ListViewItem from './UI/ListView/ListViewItem';
import styled from 'styled-components';
import { media, ContentContainer } from './styleUlti';

const Container = ContentContainer.extend`
  background-color: white;
`;
const ItemContent = styled.div`
  margin-left: 10px;
  font-size: 12px;
`;
const FirstChild = styled.p`
  margin-left: 10px;
`;

export class Help extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clearLocation: [
        {
          title: 'Turn on location in chrome',
          content: (
            <ItemContent>
              <p>1. In the upper right corner of the browser, click 3 dots symbol → Settings.</p>
              <p>2. Click Show advanced settings (at the bottom of the page).</p>
              <p>3. Click the Content settings button in the Privacy block.</p>
              <p>4. Flip the switch to the appropriate position in the Location block</p>
              <p>5. Click Done.</p>
            </ItemContent>
          )
        },
        {
          title: 'Clear location setting in chrome',
          content: (
            <ItemContent>
              <p>1. In the upper right corner of the browser, click 3 dots symbol → Settings.</p>
              <p>2. Click Show advanced settings (at the bottom of the page).</p>
              <p>3. Click the Content settings button in the Privacy block.</p>
              <p>4. Click Manage exceptions in the Location block.</p>
              <p>5. Check the line containing the name of the site and click delete symbol.</p>
              <p>6. Click Done.</p>
            </ItemContent>
          )
        },
        {
          title: 'Turn on location on iphone',
          content: (
            <ItemContent>
              <p>Go to Settings > Privacy > Location Services. </p>
            </ItemContent>
          )
        },
        {
          title: 'Clear location setting in iphone',
          content: (
            <ItemContent>
              <p>Go to Settings > General > Reset and tap Reset Location & Privacy</p>
            </ItemContent>
          )
        },
        {
          title: 'Turn on location on desktop safari',
          content: (
            <ItemContent>
              <p>Choose Safari > Preferences, click Privacy, then do any of the following:</p>
              <p>At Select a “Website use of location services” option:</p>
              <FirstChild>- Prompt for each website once each day: Safari prompts you once each day for each website you visit that requests use of location services.</FirstChild>
              <FirstChild>- Prompt for each website one time only: Safari only prompts you once for each website you visit that requests use of location services.</FirstChild>
            </ItemContent>
          )
        },
        {
          title: 'Clear location setting on desktop safari',
          content: (
            <ItemContent>
              <p>Choose Safari > Preferences, click Privacy, then do the following:</p>
              <p>Click Manage Website Data, select one or more websites, then click Remove or Remove All.</p>
            </ItemContent>
          )
        }
      ]
    }
  }

  renderClearLocationSettingInstruction() {
    return this.state.clearLocation.map((item, index) => {
      return (
        <ListViewItem
          key={index}  
          title={item.title}
          content={item.content}
        />
      )
    });
  }
  render() {
    const { formatMessage } = this.props.intl;
    const clearLocationSettingInstruction = this.renderClearLocationSettingInstruction();
    return (
      <ColorBackground color='#eceff1'>
        <TitleBar
          title={formatMessage({id: 'helpPage.title'})}
          leftButton={<RoutedBackButton/>}
        />
        <Container>
          {clearLocationSettingInstruction}
        </Container>
      </ColorBackground>
    );
  }
}

const mapStateToProps = state => state;
export default connect(mapStateToProps)(injectIntl(Help));
