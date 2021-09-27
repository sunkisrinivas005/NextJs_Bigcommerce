import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";
import axios from "axios";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import RegistrationStep1 from "../registrationPages/registrationStep1";
import RegistrationStep2 from "../registrationPages/registrationStep2";
import RegistrationStep3 from "../registrationPages/registrationStep3";
import Modal from "./modal";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

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

export default function ModalStepper({ modalActive, toggleActive }) {
  const classes = useStyles();
  const [registration, setRegistration] = React.useState({
    phoneNumberErrorRequired: true,
  });
  const [activeStep, setActiveStep] = React.useState(1);
  const [countries, setCountries] = React.useState([]);
  const [states, setStates] = React.useState([]);
  const steps = getSteps();

  React.useEffect(() => {
    // axios
    //       ('https://advertiserpro.flexoffers.com/api/registration/countries')
    //       .then(json => json.json()).then(res => {
    //           console.log(res, 'res.')
    //           setCountries(res.data.result)
    //         });
    //     axios
    //       .get('/api/registration/states')
    //       .then(json => this.setState({ states: json.data.result }));
    //   }
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
    <Modal
      isModal={modalActive}
      handleLogin={() => {}}
      toggleActive={toggleActive}
      from={"Registration"}
      large={true}
      HeaderTag="Registration"
    >
      <div className={classes.root}>
        <Stepper
          activeStep={activeStep}
          orientation="horizontal"
          color={"primary"}
        >
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {getStepContent(activeStep, {
          ...registration,
          countries: countries,
          states: states,
          phoneNumberErrorRequired: registration.phoneNumberErrorRequired,
          handleNext: handleNext,
          handleNextStep2: handleNextStep2,
          handleChange: handleChange,
          handleChangePhone: handleChangePhone,
          handleBack: handleBack,
        })}
        {/* <h3>Stepper</h3> */}
      </div>
    </Modal>
  );
}

// export default ModalStepper;
