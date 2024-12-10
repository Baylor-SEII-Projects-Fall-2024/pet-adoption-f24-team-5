router.get('/species', async (req, res) => {
    try {
        const species = await Pet.distinct('species');
        res.json(species);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching species' });
    }
});

router.get('/breeds/:species', async (req, res) => {
    try {
        const breeds = await Pet.distinct('breed', { species: req.params.species });
        res.json(breeds);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching breeds' });
    }
}); 