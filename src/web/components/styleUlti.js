// these sizes are arbitrary and you can set them to whatever you wish
import { css } from 'styled-components';
import styled from 'styled-components';
import React from 'react';

const sizes = {
  giant: 1170,
  desktop: 992,
  tablet: 768,
  phone: 320,
  landscape: 'landscape',
  portrait: 'portrait',
  phoneLandscape: 'phoneLandscape',
  phonePortrait: 'phonePortrait',
  tabletLandscape: 'tabletLandscape',
  tabletPortrait: 'tabletPortrait'
}

// iterate through the sizes and create a media template
export const media = Object.keys(sizes).reduce((accumulator, label) => {
  if (label === 'landscape' || label === 'portrait') {
    accumulator[label] = (...args) => css`
      @media (orientation: ${label}) {
        ${css(...args)}
      }
    `;
    return accumulator;
  }

  if (label === 'phoneLandscape') {
    const emSize = sizes['phone'] / 16;
    accumulator[label] = (...args) => css`
      @media (min-width: ${emSize}em) and (orientation: landscape) {
        ${css(...args)}
      }
    `;

    return accumulator;
  }

  if (label === 'phonePortrait') {
    const emSize = sizes['phone'] / 16;
    accumulator[label] = (...args) => css`
      @media (min-width: ${emSize}em) and (orientation: portrait) {
        ${css(...args)}
      }
    `;

    return accumulator;
  }

  if (label === 'tabletLandscape') {
    const emSize = sizes['tablet'] / 16;
    accumulator[label] = (...args) => css`
      @media (min-width: ${emSize}em) and (orientation: landscape) {
        ${css(...args)}
      }
    `;

    return accumulator;
  }

  if (label === 'tabletPortrait') {
    const emSize = sizes['tablet'] / 16;
    accumulator[label] = (...args) => css`
      @media (min-width: ${emSize}em) and (orientation: portrait) {
        ${css(...args)}
      }
    `;

    return accumulator;
  }

  // use em in breakpoints to work properly cross-browser and support users
  // changing their browsers font-size: https://zellwk.com/blog/media-query-units/
  const emSize = sizes[label] / 16
  accumulator[label] = (...args) => css`
    @media (min-width: ${emSize}em) {
      ${css(...args)}
    }
  `
  return accumulator
}, {});

export const ContentContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  ${media.phoneLandscape`
    margin-top: 10px;
  `}
  ${media.tablet`
    width: 75%;
    margin: 0 auto;
  `}
`;

export const FullHeightDiv = styled.div`
  height: 100%;
`;

export const TouchTapDiv = (props) => <div {...props} />;
export const TouchTapSpan = (props) => <span {...props} />

