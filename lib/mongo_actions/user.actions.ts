// "use server"
// import dbConnect from "../mongoDb";
// // import Users from "../mongoModels/user";



// export const signUp = async ({ password, ...userData }: SignUpParams) => {
//     const { email, firstName, lastName } = userData;


//     try {
//         await dbConnect()

//         const newUserAccount = await Users.create({
//             email,
//             firstName,
//             lastName,
//             password
//         })
//         return newUserAccount;

//     } catch (error) {
//         console.log(error)

//     }
// }