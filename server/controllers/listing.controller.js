import { listingModel } from '../models/listing.model.js'

const createListing = async(req,res,next) => {
    try {
        const listing = await listingModel.create(req.body)
        res.status(201).json(listing)
    } catch (error) {
        next(error)
    }
}

export { createListing } 