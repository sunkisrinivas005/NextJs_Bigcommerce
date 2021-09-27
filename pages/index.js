import {
  Heading,
  Page,
  Card,
  Layout,
  Button,
  TextContainer,
  Spinner,
  DatePicker,
  Toast,
  Frame,
  DataTable,
  Tabs,
} from "@shopify/polaris";
import { makeStyles } from "@material-ui/core/styles";
import Link from "next/link";
import React from "react";
import axios from "axios";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Modal from "./Components/modal";
// import moment from "moment";
import _ from "lodash";
import * as FileSaver from "file-saver";
import { GET_SCRIPTS_TAG, DELETE_SCRIPT_TAG } from "../mutations";

// const useStyles = makeStyles((theme) => ({
//   container: {
//     display: "flex",
//     flexWrap: "wrap",
//   },
//   textField: {
//     marginLeft: theme.spacing(1),
//     marginRight: theme.spacing(1),
//     width: 200,
//   },
//   labelRoot: {
//     fontSize: 12,
//   },
//   inputRoot: {
//     fontSize: 12,
//   },
//   input: {
//     width: "200px",
//   },
// }));
var offset = -300;
const Index = (props) => {
  const { shopOrigin } = props;
  console.log(shopOrigin, 'shopOrigin')
  // const classes = useStyles();
  const today = new Date(new Date().getTime() + offset * 60 * 1000);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() - 10);
  const [modalActive, modalSetActive] = React.useState(false);
  const [advertiserDetails, setAdvertiserID] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isLoading, setLoading] = React.useState(false);
  const { loading, error, data } = useQuery(GET_SCRIPTS_TAG);
  const [orders, setOrders] = React.useState([]);
  const [ordersLoading, setOrdersLoading] = React.useState(true);
  const [selectedDates, setSelectedDates] = React.useState({
    start: tomorrow,
    end: new Date(new Date().getTime() + offset * 60 * 1000),
  });
  const [{ month, year }, setDate] = React.useState({
    month: new Date().getUTCMonth(),
    year: new Date().getUTCFullYear(),
  });

  const [deleteErrorMessage, setDeleteError] = React.useState("");
  const [errorPop, setErrorPop] = React.useState(false);

  const [selected, setSelected] = React.useState(0);

  const handleTabChange = React.useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );

  console.log(data, "data");

  const deleteRecords = () => {
    axios
      .post(
        `https://advertiserpro.dev.flexoffers.com/api/shopifystore/uninstall`,
        { shop: shopOrigin }
      )
      .then((res) => {
        setLoading(false);
        setAdvertiserID("");
        setDeleteError("");
        modalSetActive(false);
      })
      .catch((err) => {
        let errorMessage = _.get(err, "response.data.errorMessage");
        setDeleteError(errorMessage);
      });
  };

  const [deleteScripts] = useMutation(DELETE_SCRIPT_TAG, {
    update: deleteRecords,
  });

  const toggleActive = React.useCallback(() => {
    modalActive === false && setLoading(false);
    modalSetActive((modalActive) => !modalActive);
  }, []);

  const handleDeleteScriptTag = () => {
    setLoading(true);
    const { scriptTags } = data;
    let id =
      scriptTags &&
      scriptTags.edges &&
      scriptTags.edges[0] &&
      scriptTags.edges[0].node &&
      scriptTags.edges[0].node.id
        ? scriptTags.edges[0].node.id
        : "";
    id &&
      deleteScripts({
        variables: {
          id,
        },
      });
  };

  React.useEffect(() => {
    if (!data && !_.get(data, "scriptTags.edges")) {
      console.log("test", _.isEmpty(data));
      axios
        .post(
          `https://advertiserpro.flexoffers.com/api/shopifystore/uninstall`,
          { shop: shopOrigin }
        )
        .then((res) => {
          console.log(res, "res");
        })
        .catch((err) => {
          console.log(err, "err");
        });
    }
  }, [_.get(data, "scriptTags.edges")]);

  const handleGetDetails = React.useCallback(async () => {
    await axios
      .get(
        `https://advertiserpro.flexoffers.com/api/shopifystore/advertiserDetails?storeName=${shopOrigin}`
      )
      .then((res) => {
        let { advertiserId } = res.data.result;
        setAdvertiserID(advertiserId);
        handleGetOrderDetails(advertiserId);
      })
      .catch((err) => {
        let errorMessage = _.get(err, "response.data.errorMessage");
        // errorMessage !== '' && setErrorMessage(
        //   errorMessage
        //     ? errorMessage
        //     : "Something went wrong. please contact support"
        // );
        // setErrorPop(true);
        // setTimeout(() => setErrorPop(false), 5000);
      });
  }, []);
  React.useEffect(() => {
    handleGetDetails();
  }, [handleGetDetails]);

  const handleGetOrderDetails = (id) => {
    // const advId = id ? id : advertiserDetails;
    const data = {
      StoreName: `https://${shopOrigin}/`,
    };
    axios
      .post(
        `https://advertiserpro.flexoffers.com/api/${id}/shopifystore/transactions`,
        data
      )
      .then((res) => {
        const { result } = res.data;
        const orderList =
          result && result.reportDetails ? result.reportDetails : [];
        let ordersLocal = [];
        orderList &&
          orderList.forEach((i) => {
            let newARR = [];
            newARR.push(_.get(i, "id"));
            newARR.push(_.get(i, "orderNumber"));
            newARR.push(_.get(i, "dateClicked"));
            newARR.push(_.get(i, "datePostedDisplayValue"));
            newARR.push(_.get(i, "saleAmount"));
            newARR.push(_.get(i, "domainId"));
            newARR.push(_.get(i, "domain"));
            ordersLocal.push(newARR);
          });
        ordersLocal = ordersLocal.length ? ordersLocal : [];
        setOrders(ordersLocal);
        setOrdersLoading(false);
      })
      .catch((err) => {
        console.log(err, "errr");
        setOrdersLoading(false);
      });
  };

  const handleGetReport = () => {
    const startDate = `${new Date(selectedDates.start).getFullYear()}-${
      new Date(selectedDates.start).getMonth() + 1
    }-${new Date(selectedDates.start).getDate()}`;
    const endDate = `${new Date(selectedDates.end).getFullYear()}-${
      new Date(selectedDates.end).getMonth() + 1
    }-${new Date(selectedDates.end).getDate()}`;
    axios
      .get(
        "https://advertiserpro.flexoffers.com/api/" +
          advertiserDetails +
          "/shopifystore/GenerateReport?StartDate=" +
          startDate +
          "&EndDate=" +
          endDate +
          "&storeName=https://" +
          shopOrigin +
          "/",
        { responseType: "blob" }
      )
      .then((res) => {
        FileSaver.saveAs(
          res.data,
          `salesDetails_${moment(startDate).format("MM-DD-YYYY")}-${moment(
            endDate
          ).format("MM-DD-YYYY")}.xlsx`
        );
      })
      .catch((err) => {
        console.log(err, "errr");
      });
  };

  const handleSetDates = (dates) => {
    setSelectedDates(dates);
  };

  const handleMonthChange = React.useCallback(
    (month, year) => setDate({ month, year }),
    []
  );

  const tabs = [
    {
      id: "quick_stats",
      content: "Quick Stats ( last 7 days )",
      accessibilityLabel: "quick_stats_transactions",
      panelID: "quick_stats_transactions-4",
    },
    {
      id: "Sales-Report-4",
      content: "Sales and Activity Report",
      panelID: "sales_and_activity_report-4",
    },
  ];

  return (
    <Page>
      <Layout>
        <Layout.Section>
          {loading ? (
            <Card sectioned>
              <div style={{ justifyContent: "center", textAlign: "center" }}>
                <Spinner accessibilityLabel="Spinner example" size="large" />
              </div>
            </Card>
          ) : advertiserDetails && !_.isEmpty(data) ? (
            <>
              <Card sectioned>
                <div
                  className="col-lg-12 row"
                  style={{ justifyContent: "space-between" }}
                >
                  <div className="col-lg-6">
                    <h1 element="h1">Welcome Back!</h1>
                  </div>
                  <div className="col-lg-6" style={{ textAlign: "right" }}>
                    <Button primary={true} onClick={() => toggleActive()}>
                      Uninstall
                    </Button>
                  </div>
                  <Tabs
                    tabs={tabs}
                    selected={selected}
                    onSelect={handleTabChange}
                    disclosureText="More views"
                  >
                    <Card.Section>
                      {selected === 1 ? (
                        <>
                          <div style={{ marginTop: "5px" }}>
                            <TextContainer>
                              <Heading element="h3">
                                The detailed report provides you with a complete
                                analysis of your publisher's activity and
                                revenue.
                              </Heading>
                              <Heading element="h4">
                                Select the date range and click Generate Report
                                to save your report data in a reusable format
                                for use in a dedicated application like
                                Microsoft Excel.
                              </Heading>
                            </TextContainer>
                          </div>
                          <div
                            className="col-lg-12 row"
                            style={{ marginTop: "40px" }}
                          >
                            <div className="col-lg-12">
                              <DatePicker
                                month={month}
                                year={year}
                                multiMonth
                                onChange={handleSetDates}
                                onMonthChange={handleMonthChange}
                                selected={selectedDates}
                                allowRange
                              />
                            </div>

                            <div
                              style={{ textAlign: "right", marginTop: "20px" }}
                            >
                              <Button primary={true} onClick={handleGetReport}>
                                Generate Report
                              </Button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="col-lg-12 row">
                          {ordersLoading ? (
                            <Spinner size="small" />
                          ) : (
                            <DataTable
                              columnContentTypes={[
                                "text",
                                "numeric",
                                "numeric",
                                "numeric",
                              ]}
                              headings={[
                                "Sale ID",
                                "Order Number",
                                "Date Clicked",
                                "Date Posted",
                                "Sale Amount",
                                "Publisher ID",
                                "Publisher Name",
                              ]}
                              rows={orders}
                            />
                          )}
                        </div>
                      )}
                    </Card.Section>
                  </Tabs>
                </div>
              </Card>
            </>
          ) : (
            <>
              <div className="col-lg-12 row">
                <div className="col-lg-6">
                  <Card sectioned>
                    <div
                      style={{
                        textAlign: "center",
                        justifyContent: "center",
                        height: "80px",
                      }}
                    >
                      <Heading>Existing Customers</Heading>
                      <p style={{ fontSize: "14px" }}>
                        If you are an existing FlexOffers Advertiser,{" "}
                        <Link
                          href={{
                            pathname: "/form",
                            query: { shop: shopOrigin },
                          }}
                        >
                          <span style={{ color: "blue", cursor: "pointer" }}>
                            click here{" "}
                          </span>
                        </Link>{" "}
                        to setup integration{" "}
                      </p>
                    </div>
                  </Card>
                </div>
                <div className="col-lg-6">
                  <Card sectioned>
                    <div
                      style={{
                        textAlign: "center",
                        justifyContent: "center",
                        height: "80px",
                      }}
                    >
                      <Heading>New Customer</Heading>
                      <Link
                        href={{ pathname: "/register", query: { shop: shopOrigin } }}
                      >
                        <p style={{ fontSize: "14px" }}>
                          If this is your first time using FlexOffers,{" "}
                          <span style={{ color: "blue", cursor: "pointer" }}>
                            click here
                          </span>{" "}
                          to Join our network and understand how Affiliate
                          Marketing may help you expand and optimize your
                          business{" "}
                        </p>
                      </Link>
                    </div>
                  </Card>
                </div>
              </div>
            </>
          )}
          <Frame>
            {errorPop && (
              <Toast
                content={errorMessage}
                onDismiss={() => setErrorPop(false)}
              />
            )}
          </Frame>
        </Layout.Section>
        <Modal
          isModal={modalActive}
          handleLogin={handleDeleteScriptTag}
          toggleActive={toggleActive}
          from={"Dashboard"}
          large={false}
          HeaderTag="Uninstall FlexOffers Affiliate Marketing?"
          isLoading={isLoading}
        >
          <div>
            <h4>
              By deleting this app, you will no longer be able to track
              Affiliate Traffic and Conversions
            </h4>
            {deleteErrorMessage}
          </div>
        </Modal>
      </Layout>
    </Page>
  );
};

export default Index;
