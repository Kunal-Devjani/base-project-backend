const status = {
    OK: 200,
    NotModified: 304,
    BadRequest: 400,
    Unauthorized: 401,
    NotFound: 404,
    Forbidden: 403,
    NotAcceptable: 406,
    Conflict: 409,
    InternalServerError: 500,
};

const messages = {
    succ_login: 'Logged in successfully',
    err_login_failed: 'Login failed',
    unauthorized: 'Unauthorized Access',
    USER_LOG_OUT: 'Logged Out Successfully',
    STATUS_UPDATE: 'Status updated successfully',
    CHILD_DELETE_FIRST: 'Please delete all child first',
    ONLY_SUPER_ADMIN_CAN_ACCESS: 'Only super admin can access this API.',
    COVER_IMAGE_UPDATE: 'Cover Image Updated Successfully',
    PROFILE_IMAGE_UPDATE: 'Profile Image Updated Successfully',
    COVER_IMAGE_REMOVE: 'Cover Image Removed Successfully',
    PROFILE_IMAGE_REMOVE: 'Profile Image Removed Successfully',
    IMAGE_REMOVED_SUCCESSFULLY: 'Image Removed Successfully',
    CODE_SENT_SUCCESSFULLY: 'Code Sent Successfully',
    CODE_NOT_FOUND: 'The verification code you entered is not valid. Please check your email for the correct code.',
    CODE_EXPIRED: 'The verification code is no longer valid. Please resend the code to your email.',
    CODE_VERIFIED_SUCCESSFULLY: 'Code Verified Successfully',
    ROLE_ALREADY_EXISTS: 'Role already exists! Please enter a unique role.',
    OTP_NOT_VERIFIED: 'Otp is not verified.',
    OTP_SENT_SUCCESSFULLY: 'Otp Sent Successfully',

    //User Messages
    USER_CREATE: 'User Created Successfully.',
    USER_UPDATE: 'User updated successfully',
    USER_NOT_FOUND: 'User not found',
    USER_DELETE: 'User deleted successfully',
};

module.exports = {
    messages,
    status,
};
