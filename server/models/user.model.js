import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    avatar: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvpplrMWSyQfD3d8gov2iE61qoWzzQigHYhA&usqp=CAU"
    }
})

const userModel = mongoose.model("User", userSchema)
export { userModel }