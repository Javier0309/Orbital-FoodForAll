export function isProfileComplete(business) {
    // Add/remove fields as needed for your app's requirements
    return (
      business.name &&
      business.about &&
      business.address &&
      business.foodHygieneCertUrl &&
      business.businessLicenseUrl &&
      business.halalCertUrl
      // add other required fields here
    );
  }

  