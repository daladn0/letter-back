const bcrypt = require("bcrypt");
const UserModel = require("../models/User.model");
const ApiError = require("../exceptions/ApiError");
const UserDTO = require('../dtos/UserDTO')
const TokenService = require('./Token.service')

class AuthService {
  async registration(email, password) {
    const candidate = await UserModel.findOne({ email });

    if (candidate) {
      throw ApiError.BadRequest("User already exists");
    }

    const hashedPassword = bcrypt.hashSync(
      password,
      parseInt(process.env.SALT)
    );
    
    const user = await UserModel.create({ email, password: hashedPassword });

    return new UserDTO(user)
  }

  async login(email, password) {
    const user = await UserModel.findOne({email})

    if ( !user ) {
      throw ApiError.BadRequest('Invalid credentials')
    }

    const isPassCorrect = bcrypt.compareSync(password, user.password)

    if ( !isPassCorrect ) {
      throw ApiError.BadRequest('Invalid credentials')
    }

    const userDto = new UserDTO(user)

    const tokens = TokenService.generateTokens({...userDto})

    await TokenService.saveToken(userDto.id, tokens.refreshToken)

    return {
      ...tokens,
      user: userDto
    }

  }

  async logout(refreshToken) {
    await TokenService.deleteToken(refreshToken)
  }

  async refresh(refreshToken) {
    if ( !refreshToken ) {
      throw ApiError.UnauthorizedError()
    }

    const tokenData = TokenService.validateRefreshToken(refreshToken)

    const tokenFromDB = await TokenService.findToken(refreshToken)

    if ( !tokenData || !tokenFromDB ) {
      throw ApiError.UnauthorizedError()
    }

    // TODO this logic is used for login method too
    // dry
    const user = await UserModel.findById(tokenData.id)
    const userDto = new UserDTO(user)
    const tokens = TokenService.generateTokens({...userDto})
    await TokenService.saveToken(userDto.id, tokens.refreshToken)
    return {
      ...tokens,
      user: userDto
    }
  }
}
module.exports = new AuthService();
