let auth0Client = null;

// ..

const fetchAuthConfig = () => fetch("./auth_config.json");

// ..

const configureClient = async () => {
    const response = await fetchAuthConfig();
    const config = await response.json();
  
    auth0Client = await auth0.createAuth0Client({
      domain: config.domain,
      clientId: config.clientId,
      authorizationParams: {
        audience: config.audience   // NEW - add the audience value
      }
        });
  };

  // ..


window.onload = async () => {
    await configureClient();
  
    // NEW - update the UI state
// ..

    updateUI();
  
    const isAuthenticated = await auth0Client.isAuthenticated();
  
    if (isAuthenticated) {
      // show the gated content
      return;
    }
  
    // NEW - check for the code and state parameters
    const query = window.location.search;
    if (query.includes("state=")) {
      console.log(query);
      // Process the login state
      await auth0Client.handleRedirectCallback();
      
      updateUI();
  
      // Use replaceState to redirect the user away and remove the querystring parameters
      window.history.replaceState({}, document.title, "/");
    }
  };
  

  
  // NEW
// ...

const updateUI = async () => { 
    const isAuthenticated = await auth0Client.isAuthenticated();
  
    document.getElementById("btn-logout").disabled = !isAuthenticated;
    document.getElementById("btn-login").disabled = isAuthenticated;
    if (isAuthenticated) {
      document.getElementById("gated-content").classList.remove("hidden");
  
      document.getElementById(
        "ipt-access-token"
      ).value = await auth0Client.getTokenSilently();
      var detailUser = await auth0Client.getTokenSilently({detailedResponse: true});  
      console.log(JSON.stringify(detailUser));
      console.log(document.getElementById("ipt-access-token").innerHTML); 
      document.getElementById("ipt-user-profile").textContent = JSON.stringify(
        await auth0Client.getUser() , undefined, 2
      );
  
    } else {
      document.getElementById("gated-content").classList.add("hidden");
    }
  };
  
  // ..

  // ..

const login = async () => {
    await auth0Client.loginWithRedirect({
      authorizationParams: {
     
        redirect_uri: window.location.origin
      }
    });
  };

  const logout = () => {
    auth0Client.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };


