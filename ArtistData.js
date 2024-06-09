import ArtistModel from "../models/ArtistModel.js";
export const addArtist = async({artistID,saloonName,city,address,phoneNumber,specialization,gender,serviceFor,serviceType,description,availabilityDays,masPrice,minPrice,userid}) => {
    const artist = await ArtistModel.create({
        artistID,
        saloonName,
        city,
        address,
        phoneNumber,
        specialization,
        gender,
        serviceFor,
        serviceType,
        description,
        availabilityDays,
        masPrice,
        minPrice,
        userid,
    });
    return artist;
};
