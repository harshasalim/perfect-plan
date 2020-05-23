export default {
    palette: {
        primary: {
          light: '#d81b60',
          main: '#f50057',
          dark: '#bb002f',
          contrastText: '#fff',
        },
        secondary: {
          light: '#9c4dcc',
          main: '#6a1b9a',
          dark: '#38006b',
          contrastText: '#fff',
        }
      },
      formFeatures: {
        form: {
          textAlign: 'center',
        },
        image: {
            margin: '20px auto 5px auto',
        },
        pageTitle: {
            margin: '10px auto 10px auto',
        },
        textField: {
            margin: '10px auto 10px auto',
        },
        button: {
            marginTop: 20,
            position: 'relative',
        },
        customError: {
            color: 'red',
            fontSize: '0.8rem',
            marginTop: 10,
        },
        progress: {
            position: 'absolute',
        },
        typography: {
          useNextVariants: true,
        },
        invisibleSeparator: {
          border: 'none',
          margin: 4
        },
        visibleSeparator: {
          width: '100%',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
          marginBottom: 20
        }
      },
      profileFeatures: {
        paper: {
          padding: 20
        },
        profile: {
          '& .image-wrapper': {
            textAlign: 'center',
            position: 'relative',
            '& button': {
              position: 'absolute',
              top: '80%',
              left: '70%'
            }
          },
          '& .profile-image': {
            width: 200,
            height: 200,
            objectFit: 'cover',
            maxWidth: '100%',
            borderRadius: '50%'
          },
          '& .profile-details': {
            textAlign: 'center',
            '& span, svg': {
              verticalAlign: 'middle'
            },
            '& a': {
              color: '#f50057'
            }
          },
          '& hr': {
            border: 'none',
            margin: '0 0 10px 0'
          },
          '& svg.button': {
            '&:hover': {
              cursor: 'pointer'
            }
          }
        },
        buttons: {
          textAlign: 'center',
          '& a': {
            margin: '20px 10px'
          }
        }
          
      }
    
}