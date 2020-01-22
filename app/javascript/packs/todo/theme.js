const heading = {
  color: 'text',
  fontFamily: 'body',
  lineHeight: 'heading',
  fontWeight: 'heading',
}

export const base = {
  space: [0, 4, 8, 16, 32, 64, 96, 128, 256, 512],
  radii: [0, 4, 8, 16, 32, 64, 96, 128, 256, 512],
  fonts: {
    body: '"Poppins", sans-serif',
    heading: '"Poppins", sans-serif',
    monospace: 'Menlo, monospace',
  },
  sizes: {
    container: "1024px",
  },
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 96],
  fontWeights: {
    body: 300,
    heading: 300,
    bold: 700,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.4,
  },
  colors: {
    text: '#000',
    background: '#fff',
    primary: '#ff0566',
    secondary: '#30c',
    alt: '#61CECE',
    muted: '#f6f6f6',
    mutedText: '#8798ad',
    highlight: 'rgba(255, 158, 195, 0.5)'
  },
  badges: {
    primary: {
      py: 2,
      px: 2,
      borderRadius: 999,
      fontWeight: 200,
    }
  },
  inputs: {
    search: {
      borderRadius: "99px",
    }
  },
  buttons: {
    primary: {
      cursor: 'pointer',
      display: 'inline-block',
      borderRadius: 99,
      backgroundColor: 'alt',
      fontSize: 1,
      color: "background",
      border: "none",
      boxShadow: "0 20px 60px -14px rgba(0,0,0,0.38)",
      fontWeight: '400',
      py: 12,
      px: 4,
      minWidth: ['auto', 208],
      textAlign: 'center',
      textDecoration: 'none',
      lineHeight: '20px',
      transition: 'box-shadow 0.3s',
      ':focus': {
        boxShadow: "0 0 0px 1px #fff, 0 0 0px 4px #61CECE",
        outline: 'none'
      },
      ':hover': {
        boxShadow: "0 20px 60px -5px rgba(0,0,0,0.38)",
      },
      ':active': {
        boxShadow: 'none'
      },

      '[disabled]': {
        opacity: 0.4
      }
    },
  },
  text: {
    paragraph: {
      fontSize: 5,
      color: "#fff",
      mt: 0,
      mb: 0,
      textTransform: "none"
    },
    heading: {
      letterSpacing: '-0.46px',
      fontWeight: 'heading',
      fontSize: 4,
      lineHeight: '2.5em',
    },
  },
  forms: {
    label: {
      display: 'block',
      color: '#8798ad',
      fontSize: 1,
      lineHeight: '2em'
    },
    input: {
      backgroundColor: '#eff3ff',
      width: '100%',
      padding: '12px 16px',
      border: 'none',
      fontWeight: '300',
      lineHeight: '20px',
      borderRadius: '4px',

      '&:focus': {
        boxShadow: ' 0 0 0 1px #2684FF',
        outline: 'none',
      },
    }
  },
  styles: {
    root: {
      fontFamily: 'body',
      lineHeight: 'body',
      fontWeight: 'body',
    },
    Layout: {
      minHeight: 'calc(100vh - 70px)'
    },
    Main: {
      minHeight: 'calc(100vh - 270px)'
    },
    Container: {
      maxWidth: 1024,
      py: 0,
      px: 3,
    },
    h1: {
      ...heading,
      fontSize: 6,
    },
    h2: {
      ...heading,
      fontSize: 1,
      letterSpacing: 1.15,
      lineHeight: '2em',
      textTransform: 'uppercase',
      m: 0,
    },
    h3: {
      ...heading,
      fontSize: 3,
    },
    h4: {
      ...heading,
      fontSize: 2,
    },
    h5: {
      ...heading,
      fontSize: 1,
    },
    h6: {
      ...heading,
      fontSize: 0,
    },
    p: {
      color: 'text',
      fontFamily: 'body',
      fontWeight: 'body',
      lineHeight: 'body',
    },
    a: {
      fontWeight: 'body',
      color: 'secondary',
      ":focus": {
        outline: 'none',
        backgroundColor: 'background',
        color: 'primary',
        transition: 'box-shadow 0.3s',
        paddingX: 2,
        boxShadow: "0 0 0px 1px #ff0566, 0 0 0px 2px rgba(255,255,255,1)",

      },
    },
    pre: {
      fontFamily: 'monospace',
      overflowX: 'auto',
      code: {
        color: 'inherit',
      },
    },
    code: {
      fontFamily: 'monospace',
      fontSize: 'inherit',
    },
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: 0,
    },
    th: {
      textAlign: 'left',
      borderBottomStyle: 'solid',
    },
    td: {
      textAlign: 'left',
      borderBottomStyle: 'solid',
    },
    img: {
      maxWidth: '100%',
    },
  },
}

export default base