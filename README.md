# westmoor-downtime-planner

A downtime planning tool for D&D 5e based on the Xanathar Guide to Everything rule book.

This project is currently considered as aplha quality software.

## Requirements
- .NET Core 3.1
- @angular/cli
- CosmosDB Emulator

## Running the project
This project is built using the "ASP.NET Core with Angular" application template and works the same as the template. Simply open the solution in your favourite IDE and debug the project.

You will have to set some appsettings in your user secrets that are documented in the main appsettings.json file for the application to start.

To browse the admin view, you will need to manually add an ApiKeyEntity document to your CosmosDB collection. Here is a sample that you can include to test the app:

```json
{
    "owner": "Dev Team",
    "roles": [
        "Admin"
    ],
    "id": "generate a guid and put it here, it is your API key",
    "idp": "ApiKeyEntity",
    "typeName": "ApiKeyEntity",
    "typeVersion": 1,
    "createdOn": "2020-07-08T01:47:10.7783369+00:00",
    "modifiedOn": null
}
```
