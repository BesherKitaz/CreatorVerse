import { useState } from 'react'
import { Route, Routes, BrowserRouter } from 'react-router-dom'

import './App.css'

import Creators from './pages/ShowCreators'
import { AddCreator } from './pages/CreatorForm'
import { supabase } from './client'
import CreatorDetails from './pages/CreatorDetails'


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Creators />} />
          <Route path="/add-creator" element={<AddCreator />} />
          <Route path="/edit-creator/:id" element={<AddCreator />} />
          <Route path="/creator/:id" element={<CreatorDetails />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
