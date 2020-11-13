/**
 * User Module (PUT update a user)
 * - can only be done by the owner of the account or admin type user
- owner of account can take in password, first name, last name but not all are required.
- if admin type user, can only change password or isAdmin 
- if no payload has been sent or payload is empty, return bad request (400)
- if owner of account and not admin and updates isAdmin, return forbidden (403)
- if admin type user and updates first name or last name, return forbidden (403)
- if admin type user removes isAdmin status on himself and there are no admins left in the list, it should return forbidden (403) and should not update the database
- if userId in the parameter is not found in the database, return not found (404)
- dateUpdated should be updated with the current date
- if owner of account, should return username, firstname, lastname, isAdmin, dateCreated, dateUpdated
- if admin, should return only username, isAdmin, dateCreated, dateUpdated
 */