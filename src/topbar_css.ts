import { css, cx } from '@emotion/css';

export const topBarCss = css({
  display: 'flex',
  borderBottom: '1px solid rgb(152,152,152)',
  justifyContent: 'space-between',
  height: '2.5rem',
  alignItems: 'center',
});

export const leftMenu = css({
  display: 'flex',
  paddingLeft: '10px',
});

export const rightMenu = css({
  display: 'flex',
  height: '100%',
});

export const menuContent = css({
  padding: '0.4rem 0.8rem',
  textAlign: 'center',
  borderRadius: '0.5rem',
  marginRight: '0.1rem',
  position: 'relative',
  '&:hover': {
    backgroundColor: 'rgb(219,219,219)',
  },
  '&:active': {
    backgroundColor: 'rgb(120,120,120)',
  },
});

export const closeBtnCss = cx(menuContent, css({
  fontSize: 'large',
  padding: '0px 0px',
  borderRadius: '0px',
  aspectRatio: '1/1',
  margin: '0px',
  height: '100%',
  transition: 'background-color 0.1s linear',
  backgroundColor: 'white',
  '&:hover': {
    backgroundColor: 'rgba(252, 51, 44, 1.0)',
  },
  img: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%,-50%)',
  },
}));

export const miniBtnCss = cx(closeBtnCss, css({
  '&:hover': {
    backgroundColor: 'rgb(168, 167, 167)',
  },
  '&:active': {
    backgroundColor: 'rgb(120, 120, 120)',
  },

}));
export const dropMenuContent = css({
  position: 'absolute',
  top: '100%',
  left: '0px',
  backgroundColor: 'rgb(240, 240, 240)',
  textAlign: 'left',
  borderRadius: '0.3rem',
  paddingTop: '0.3rem',
  minWidth: '10rem',

});

export const dropMenuIem = css({
  padding: '0.3rem 0.3rem 0.3rem 0.3rem',
  whiteSpace: 'nowarp',
  '&: hover': {
    backgroundColor: 'rgb(159, 159, 159)',
  },
  '&:active': {
    backgroungColor: 'rgb(120, 120, 120)',
  },
});
