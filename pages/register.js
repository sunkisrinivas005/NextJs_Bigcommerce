import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Page, Layout, Card } from "@shopify/polaris";
// import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
// import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import axios from "axios";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
// import Button from "@material-ui/core/Button";
// import Typography from "@material-ui/core/Typography";
import RegistrationStep1 from "./registrationPages/registrationStep1";
import RegistrationStep2 from "./registrationPages/registrationStep2";
import RegistrationStep3 from "./registrationPages/registrationStep3";
import { isValidPhoneNumber } from "react-phone-number-input";
// import './styles.css'
// import Modal from "./modal";
const useStyles = () => ({
  root: {
    width: "100%",
    padding: "20px",
    // backgroundColor:'white',
    justifyContent: "center",
    alignSelf: "center",
  },
  backButton: {
    marginRight: '10px',
  },
  instructions: {
    marginTop: '10px',
    marginBottom: '10px',
  },
  resize: {
    fontSize: 50,
  },
});

// const theme = createMuiTheme({
//   palette: {
//     primary: {
//       main: "#05bfa5",
//       contrastText: "#fff", //button text white instead of black
//     },
//   },
// });

function getSteps() {
  return ["Your Information", "Company Information", "Done"];
}

function getStepContent(step, props) {
  switch (step) {
    case 0:
      return <RegistrationStep1 {...props} />;
    case 1:
      return <RegistrationStep2 {...props} />;
    case 2:
      return <RegistrationStep3 {...props} />;
    default:
      return "Unknown step";
  }
}

const Register = () => {
  const classes = useStyles();
  const [registration, setRegistration] = React.useState({
    phoneNumberErrorRequired: true,
    promoCode: "SHOPIFY",
  });
  const [activeStep, setActiveStep] = React.useState(0);
  const [countries, setCountries] = React.useState([]);
  const [states, setStates] = React.useState([]);
  const steps = getSteps();

  React.useEffect(() => {
    axios("https://advertiserpro.flexoffers.com/api/shopifystore/countries")
      .then((res) => {
        setCountries(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get("https://advertiserpro.flexoffers.com/api/shopifystore/states")
      .then((json) => setStates(json.data.result))
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleChangePhone = (p) => {
    let { phone } = registration;
    phone = p;
    setRegistration({
      ...registration,
      phone,
      phoneNumberErrorRequired: false,
    });
  };

  const handleChange = (name) => (event) => {
    registration[name] = event.target.value;
    setRegistration({ ...registration });
  };

  const handleNextStep2 = () => {
    if (!registration.phone) {
      setRegistration({ ...registration, phoneNumberErrorRequired: true });
      return;
    }

    if (!isValidPhoneNumber(registration.phone)) {
      return;
    }

    setActiveStep((activeStep) => ++activeStep);
  };

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            {/* <MuiThemeProvider theme={theme}> */}
            <div className={classes.root}>
              <div style={{ alignSelf: "center" }}>
                <Stepper
                  activeStep={activeStep}
                  orientation="horizontal"
                  color={"primary"}
                >
                  {steps.map((label, index) => (
                    <Step key={index}>
                      <StepLabel>
                        <span style={{ fontSize: "12px" }}>{label}</span>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
                {getStepContent(activeStep, {
                  ...registration,
                  countries: countries,
                  states: states,
                  phoneNumberErrorRequired:
                    registration.phoneNumberErrorRequired,
                  handleNext: handleNext,
                  handleNextStep2: handleNextStep2,
                  handleChange: handleChange,
                  handleChangePhone: handleChangePhone,
                  handleBack: handleBack,
                })}
              </div>
            </div>
            {/* </MuiThemeProvider> */}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default withStyles(useStyles)(Register);
