import {
  Heading,
  Page,
  Card,
  Layout,
  TextStyle,
  TextField,
  Button,
} from "@shopify/polaris";
import { useState, useCallback } from "react";
import { useMutation } from "@apollo/react-hooks";
import Modal from "./Components/modal";
import axios from "axios";
import React from "react";
import { CREATE_SCRIPT_TAG } from "../mutations";

const Form = (props) => {
  const [advertiserID, setValue] = useState("");
  const [aid, setAid] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const {shopOrigin} = props;
  console.log(props, 'shop')
  const [createScripts] = useMutation(CREATE_SCRIPT_TAG);
  const [successMessage, setSuccessMessage] = useState("");
  const [active, setActive] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginErrorMessage] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [getAdvertiserDetails, setGetAdvertiserDetails] = useState(false);

  const toggleActive = useCallback(() => {
    setActive((active) => !active);
    setEmail("");
    setPassword("");
    setLoginErrorMessage("");
  }, []);

  const installScript = () => {
    setSubmitLoading(true);
    addAdvertiser();
  };

  const handleValidation = (e) => {
    if (!isNaN(parseFloat(e)) && isFinite(e)) {
      setValue(e);
    }
  };

  const addAdvertiser = () => {
    fetch(
      "https://advertiserpro.flexoffers.com/api/" +
        advertiserID +
        "/shopifystore",
      {
        method: "POST",
        body: JSON.stringify({ StoreName: shopOrigin, Aid: aid }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Access-Control-Allow-Origin": true,
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        const { errorMessage } = json;
        if (errorMessage === null) {
          createScripts({
            variables: {
              input: {
                src:
                  window.location.origin +
                  "/public/flexOffers-shopify.js?ADVID=" +
                  aid,
                displayScope: "ALL",
              },
            },
          });
          setSubmitLoading(false);
          setSuccessMessage(
            `Conversion Tracking successfully installed for ${advertiserID}`
          );
        } else {
          setErrorMessage(errorMessage);
          setSuccessMessage("");
          setTimeout(() => setErrorMessage(""), 5000);
        }
      })
      .catch((err) => {});
  };

  const handleLogin = async () => {
    let data = {
      email,
      password,
    };
    let headers = {
      "Content-type": "application/json; charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
    };
    setLoading(true);
    if (email.length && password.length) {
      axios
        .post(
          "https://advertiserpro.flexoffers.com/api/shopifystore/ShopLogin",
          data,
          { headers }
        )
        .then((response) => {
          let { advertiserId, aid } = response.data.result;
          setAid(aid);
          setValue(advertiserId.toString());
          setEmail("");
          setPassword("");
          toggleActive();
          setGetAdvertiserDetails(true);
          setLoading(false);
        })
        .catch((err) => {
          // console.log(err, err.response, err.message, 'testing...')
          let errorMessage = err.response.data.errorMessage
            ? err.response.data.errorMessage
            : "";
          setLoginErrorMessage(errorMessage);
          setLoading(false);
        });
    }
  };
  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <>
              {}
              {getAdvertiserDetails ? (
                <>
                  <h2
                    element="h1"
                    style={{ fontSize: "25px", padding: "10px" }}
                  >
                    Just one more step...
                  </h2>
                  <div style={{ padding: "5px 10px" }}>
                    <p style={{ fontSize: "16px" }}>
                      <strong>
                        The FlexOffers network provided us with your Advertiser
                        ID and AID.
                      </strong>
                    </p>
                  </div>
                  <div style={{ padding: "0px 10px" }}>
                    <p style={{ fontSize: "16px" }}>
                      To install Conversion Tracking, click the
                      <strong> Install </strong>
                      button.
                    </p>
                  </div>
                  <div style={{ padding: "2px 10px" }}>
                    <p style={{ fontSize: "16px" }}>
                      You will be able to track traffic and sales by Publishers
                      after tracking is installed.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <h2
                    element="h1"
                    style={{ fontSize: "25px", padding: "10px" }}
                  >
                    Get your Store ready for Affiliate Marketing with FlexOffers
                  </h2>
                  <div style={{ padding: "5px 10px" }}>
                    <p style={{ fontSize: "16px" }}>
                      <strong>
                        Enter your Flexoffers Advertiser ID and click install to
                        setup Conversion Tracking
                      </strong>
                    </p>
                  </div>
                  <div style={{ padding: "0px 10px" }}>
                    <p style={{ fontSize: "16px" }}>
                      Your Shopify store will then be able to measure sales and
                      attribute them to Publishers.
                    </p>
                  </div>
                  <div style={{ padding: "2px 10px" }}>
                    <p style={{ fontSize: "16px" }}>
                      {" "}
                      ( If you don't have an FlexOffers Advertiser ID, please
                      <span
                        style={{
                          color: "blue",
                          cursor: "pointer",
                          padding: "0px 5px",
                        }}
                        onClick={() => toggleActive(!active)}
                      >
                        click here
                      </span>
                      to get Advertiser ID and AID )
                    </p>
                  </div>
                </>
              )}
              <div style={{ width: "30%", padding: "5px 10px" }}>
                <div>
                  <div style={{ paddingBottom: "10px" }}>
                    <TextField
                      name="advertiserID"
                      label="Advertiser ID"
                      value={advertiserID}
                      onChange={(e) => handleValidation(e)}
                      align="left"
                    />
                  </div>
                  <TextField
                    name="aid"
                    label="AID"
                    value={aid}
                    onChange={(e) => setAid(e)}
                    align="left"
                  />
                </div>
              </div>
              {successMessage && (
                <div>
                  <p
                    style={{
                      fontSize: "16px",
                      color: "green",
                      fontWeight: 500,
                    }}
                  >
                    {successMessage}
                  </p>
                </div>
              )}
              <p style={{ fontSize: "16px", color: "red" }}>
                {errorMessage && errorMessage.length ? `${errorMessage} *` : ""}
              </p>
              <div style={{ textAlign: "right" }}>
                <Button
                  loading={submitLoading}
                  primary={true}
                  monochrome={true}
                  onClick={() => installScript()}
                  disabled={advertiserID.length && aid.length ? false : true}
                >
                  Install
                </Button>
              </div>
            </>
          </Card>
        </Layout.Section>
        <Modal
          isModal={active}
          handleLogin={handleLogin}
          toggleActive={toggleActive}
          from={"Login"}
          large={false}
          isLoading={isLoading}
          HeaderTag="Login to FlexOffers Affiliate Marketing"
        >
          <div style={{ paddingBottom: "10px" }}>
            <div className="col-lg-6">
              <TextField
                name="Email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e)}
                align="left"
              />
            </div>
            <div className="col-lg-6">
              <TextField
                name="aid"
                label="Password"
                type={"password"}
                value={password}
                onChange={(e) => setPassword(e)}
                align="left"
              />
            </div>
            {loginError && (
              <p style={{ color: "red", fontSize: "14px", paddingTop: "10px" }}>
                {loginError ? loginError : ""}
              </p>
            )}
          </div>
        </Modal>
      </Layout>
    </Page>
  );
};

export default Form;
