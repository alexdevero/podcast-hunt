const express = require('express')

const Episode = require('./../models/episode-model')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const episodes = await Episode.find()

    res.json(episodes)
  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
})

router.get('/:episode_id', async (req, res) => {
  try {
    const episode = await Episode.find({ id: req.params.episode_id })

    if (episode !== null || (Array.isArray(episode) && episode.length !== 0)) {
      res.json(episode)
    } else {
      res.status(404).json({ message: 'Couldn\'t find specified episode.' })
    }
  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
})

router.post('/create', async (req, res) => {
  try {
    const episode = new Episode({
      title: req.body.title,
      url: req.body.url,
      description: req.body.description
    })

    const newEpisode = await episode.save().then(() => {
      res.json({ message: 'Episode created.' })
    })
  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
})

router.patch('/update', async (req, res) => {
  try {
    if (req.body._id !== null) {
      const updateEpisode = { ...req.body }

      const episode = Episode.findOneAndUpdate({ _id: req.body._id }, updateEpisode, { useFindAndModify: false }, (err) => {
        if (err) {
          res.status(500).json({ message: err.message })
        } else {
          res.json({ message: 'Episode updated.' })
        }
      })
    } else {
      res.status(500).json({ message: 'Please specify episode id.' })
    }
  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
})

router.delete('/delete', async (req, res) => {
  try {
    if (req.body._id !== null) {
      const episode = await Episode.remove({ _id: req.body._id }, (err) => {
        if (err) {
          res.status(500).json({ message: err.message })
        } else {
          res.json({ message: 'Episode deleted.' })
        }
      })
    }
  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
})

module.exports = router
