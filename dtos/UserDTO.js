module.exports = class UserDTO {
    email;
    id;

    /**
     * User DTO
     * @param {Object} model - User's model
     * @param {string} model.email - User's email
     * @param {string} model.id - User's id
     */
    constructor(model) {
        this.email = model.email
        this.id = model._id
    }
}