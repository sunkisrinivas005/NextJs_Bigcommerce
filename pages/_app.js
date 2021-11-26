import App from "next/app";


function MyProvider(props) {
  const Component = props.Component;
  return (
      <Component {...props} />
  );
}

class MyApp extends App {
  render() {
    const { Component, pageProps, context} = this.props;
    return (
          <MyProvider
            Component={Component}
            {...pageProps}
            context={context}
          />
    );
  }
}

MyApp.getInitialProps = async ({ ctx }) => {
  return {
    context: ctx.query.context,
  };
};

export default MyApp;
