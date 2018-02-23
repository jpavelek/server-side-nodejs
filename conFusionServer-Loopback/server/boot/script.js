module.exports = function(app) {
    var Customer = app.models.Customer;

    Customer.findOne({username: "Admin"}, function(err, users) {
        if (!users) {
            //No Admin configured
            console.log("No Admin account, creating ...");
            Customer.create([{
                username: "Admin",
                email: "admin@confusion.net",
                password: "password"
            }], function(err, users) {
                if (err) throw(err); //Admin creation failed
                else {
                    var Role = app.models.Role;
                    var RoleMapping = app.models.RoleMapping;

                    RoleMapping.destroyAll();

                    RoleMapping.findOne({ name: "admin"}, function(err, role) {
                        if (!role) {
                            //Admin role does not exist, create
                            console.log("Admin role does not exist, creating ...");
                            Role.create({ name: "admin"}, function(err, role) {
                                if (err) throw(err); 
                                else {
                                    console.log("Admin role created");
                                    role.principals.create({
                                        principalType: RoleMapping.USER,
                                        principalId: users[0].id
                                    }, function(err, principal) {
                                        if (err) throw(err);
                                    });
                                    console.log("Admin role mapped");
                                }
                            });
                        } else {
                            //Admin role EXISTS, just map it to the user
                            role.pricipals.create({
                                principalType: RoleMapping.USER,
                                principalId: users[0].id
                            }, function(err, principal) {
                                if (err) throw(err);
                            });
                            console.log("Adming role existed, mapped to this admin");
                        }
                    });
                }
            });
        }
    });
}