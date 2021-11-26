import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from 'next/router'
import { Grid, GridItem, Box, H1 } from "@bigcommerce/big-design";

function IndexPage(props) {
  const router = useRouter()
useEffect(() => {
  router.push('/home')
}, [])
  return (
    <Box padding={{ mobile: "none", tablet: "medium", desktop: "xLarge" }}>
      <Grid gridColumns="repeat(3, 1fr)">
        {/* <Flex> */}
        <GridItem>
          <Box>
            <H1>Existing Customers</H1>
            <p style={{ fontSize: "14px" }}>
              If you are an existing FlexOffers Advertiser,{" "}
              <Link
                href={{
                  pathname: `/form`,
                  query:{context:props.context}
                }}
              >
                <span style={{ color: "blue", cursor: "pointer" }}>
                  click here{" "}
                </span>
              </Link>{" "}
              to setup integration{" "}
            </p>
          </Box>
        </GridItem>

        <GridItem>
          <Box>
            <H1>New Customers</H1>
            <p style={{ fontSize: "14px" }}>
              If this is your first time using FlexOffers,{" "}
              <span style={{ color: "blue", cursor: "pointer" }}>
                click here
              </span>{" "}
              to Join our network and understand how Affiliate Marketing may
              help you expand and optimize your business{" "}
            </p>
          </Box>
        </GridItem>
        {/* </Flex> */}
      </Grid>
    </Box>
  );
}

export default IndexPage;
