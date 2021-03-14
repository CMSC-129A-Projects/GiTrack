const roboto = 'Roboto, Arial, Helvetica Neue, Helvetica, sans-serif';
const raleway = 'Raleway, Arial, Helvetica Neue, Helvetica, sans-serif';
const materialIcons = 'Material Icons';

const robotoM = {
  fontFamily: roboto,
  fontStyle: 'normal',
  fontWeight: 600,
};

const robotoR = {
  fontFamily: roboto,
  fontStyle: 'normal',
  fontWeight: 400,
};

const ralewayB = {
  fontFamily: raleway,
  fontStyle: 'normal',
  fontWeight: 700,
};

const icon = {
  fontFamily: materialIcons,
  fontStyle: 'normal',
  fontWeight: 'normal',
  display: 'inline-block',
  textTransform: 'none',
  letterSpacing: 'normal',
  wordWrap: 'normal',
  whiteSpace: 'nowrap',
  direction: 'ltr',
};

const theme = {
  color: {
    primary: [
      '#fff', // Do not use
      '#fff', // 1
      '#fff', // 2
      '#2057E3', // 3
    ],
    neutral: [
      '#fff', // 0
      '#FBFBFB', // 1
      '#F0F0F0', // 2
      '#E8E8E8', // 3
      '#88919B', // 4
      '#9E9E9E', // 5
      '#fff', //6
      '#2F2F2F', //7
    ],
    red: [
      '#fff', // Do not use
      '#fff', // 1
      '#fff', // 2
      '#DB4646', // 3
    ],
  },

  text: {
    headingLG: {
      ...ralewayB,
      fontSize: '3.5rem',
      lineHeight: '1em',
    },
    headingMD: {
      ...ralewayB,
      fontSize: '2.5rem',
      lineHeight: '1em',
    },
    headingSM: {
      ...ralewayB,
      fontSize: '2rem',
      lineHeight: '1em',
    },
    headingXS: {
      ...ralewayB,
      fontSize: '1.5rem',
      lineHeight: '1em',
    },
    bodyXS: {
      ...robotoR,
      fontSize: '0.625rem',
      lineHeight: '0.875em',
    },
    bodySM: {
      ...robotoR,
      fontSize: '0.75rem',
      lineHeight: '1em',
    },
    bodyMD: {
      ...robotoR,
      fontSize: '0.875rem',
      lineHeight: '1.25em',
    },
    bodyLG: {
      ...robotoR,
      fontSize: '1rem',
      lineHeight: '1.5em',
    },
    titleXS: {
      ...robotoM,
      fontSize: '0.625rem',
      lineHeight: '0.875em',
    },
    titleSM: {
      ...robotoM,
      fontSize: '0.75rem',
      lineHeight: '1em',
    },
    titleMD: {
      ...robotoM,
      fontSize: '0.875rem',
      lineHeight: '1.25em',
    },
    titleLG: {
      ...robotoM,
      fontSize: '1rem',
      lineHeight: '1.5em',
    },
    icon: {
      ...icon,
      fontSize: '1rem',
      lineHeight: '1',
    },
  },

  transition: {
    default: (tags) => {
      const lastIndex = tags.length - 1;
      return tags.reduce(
        (accumulator, tag, index) =>
          (accumulator += `ease 0.2s ${tag}${index !== lastIndex ? ',' : ''} `),
        ''
      );
    },
  },
};

export default theme;
