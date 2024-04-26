const importServiceUrl = "https://your-import-service-url/import";

const authorizationToken = localStorage.getItem("authorization_token");

async function makeImportRequest() {
  try {
    const response = await fetch(importServiceUrl, {
      method: "GET",
      headers: {
        Authorization: `Basic ${authorizationToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Import data:", data);
    } else if (response.status === 401) {
      console.error(
        "Unauthorized: Authorization header not provided or invalid."
      );
    } else if (response.status === 403) {
      console.error("Forbidden: Access denied.");
    } else {
      console.error("Request failed with status:", response.status);
    }
  } catch (error) {
    console.error("Request failed:", error);
  }
}

void makeImportRequest();
