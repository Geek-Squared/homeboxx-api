const Organization = require("../models/OrganizationModel");
const User = require("../models/UserModel");
const Invitation = require("../models/InvitationModel");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sgMail = require('@sendgrid/mail');

// Set the API key
sgMail.setApiKey('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');

// Create a new organization
exports.createOrganization = async (req, res) => {
  const organization = new Organization({
    ...req.body,
    members: [req.userId],
  });
  await organization.save();
  res.json(organization);
};

// Add a member to an organization
exports.addMemberToOrganization = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  const organization = await Organization.findById(req.params.orgId);

  if (user) {
    // If the user exists, add them to the organization
    organization.members.push(user._id);
    user.organization = organization._id;
    await organization.save();
    await user.save();
  } else {
    // If the user doesn't exist, create an invitation
    const token = crypto.randomBytes(16).toString('hex');
    const invitation = new Invitation({
      email,
      organizationId: organization._id,
      token,
      expiresAt: new Date(Date.now() + 24*60*60*1000), // 24 hours from now
    });
    await invitation.save();

    // Send an email with the link to the registration form
    const msg = {
      to: email,
      from: 'msngwelz@gmail.com',
      templateId: 'd-c0a171e7d0e1471b925124f3981589f1',
      dynamicTemplateData: {
        link: `http://your-website.com/register?token=${token}`,
        // Add any other dynamic data your template needs here
      },
    };

    sgMail
      .send(msg)
      .then(() => console.log('Email sent'))
      .catch((error) => console.error(error));
  }

  res.json(organization);
};
// Get all organizations
exports.getAllOrganizations = async (req, res) => {
  const organizations = await Organization.find({});
  res.json(organizations);
};

// Read an organization by ID
exports.getOrganization = async (req, res) => {
  const organization = await Organization.findById(req.params.orgId);
  if (!organization) {
    return res.status(404).send('Organization not found.');
  }
  res.json(organization);
};

// Update an organization by ID
exports.updateOrganization = async (req, res) => {
  const organization = await Organization.findByIdAndUpdate(req.params.orgId, req.body, { new: true });
  if (!organization) {
    return res.status(404).send('Organization not found.');
  }
  res.json(organization);
};

// Delete an organization by ID
exports.deleteOrganization = async (req, res) => {
  const organization = await Organization.findByIdAndRemove(req.params.orgId);
  if (!organization) {
    return res.status(404).send('Organization not found.');
  }
  res.json({ message: 'Organization deleted successfully.' });
};


