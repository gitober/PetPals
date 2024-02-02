// controllers/petController.js
const { mockPets } = require("../utils/mockData");

exports.getAllPets = (req, res) => {
  res.json(mockPets);
};

exports.getPetById = (req, res) => {
  const { id } = req.params;
  const pet = mockPets.find((pet) => pet.id === parseInt(id));
  if (pet) {
    res.json(pet);
  } else {
    res.status(404).json({ error: "Pet not found" });
  }
};
