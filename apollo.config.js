module.exports = {
  client: {
    includes: ["./src/**/*.{tsx,ts}"],
    tagName: "gql",
    service: {
      name: "hcast-backend",
      url:
        process.env.NODE_ENV === "production"
          ? "https://hcast-backend.herokuapp.com/graphql"
          : "http://localhost:4000/graphql",
    },
  },
};
