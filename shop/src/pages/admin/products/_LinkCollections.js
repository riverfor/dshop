import React, { useState, useMemo } from 'react'

import useCollections from 'utils/useCollections'
import CreateCollection from '../collections/_New'

const CollectionItemCheckboxes = ({
  collections,
  onChange,
  selectedValues,
  uniquePrefix
}) => {
  const onInputChange = (e) => {
    if (e.target.checked) {
      onChange(Array.from(new Set([...selectedValues, e.target.value])))
    } else {
      onChange(selectedValues.filter((x) => x !== e.target.value))
    }
  }

  return collections.map((collection, index) => (
    <div className="form-check" key={collection.id} tabIndex={index}>
      <input
        type="checkbox"
        checked={selectedValues.includes(collection.id)}
        onChange={onInputChange}
        value={collection.id}
        id={`${uniquePrefix}${collection.id}`}
        className="form-check-input"
      />
      <label
        className="form-check-label"
        htmlFor={`${uniquePrefix}${collection.id}`}
      >
        {collection.title}
      </label>
    </div>
  ))
}

const LinkCollections = ({ selectedValues, onChange }) => {
  const [searchVal, setSearchVal] = useState('')

  const { collections, loading } = useCollections()

  const searchResults = useMemo(() => {
    if (!collections || loading) return []

    const val = (searchVal || '').toLowerCase()

    if (val.trim().length === 0) return []

    return collections.filter((x) => {
      return (
        x.title.toLowerCase().includes(val) || x.id.toLowerCase().includes(val)
      )
    })
  }, [searchVal, collections, loading])

  const selectedCollections = useMemo(() => {
    if (!collections) return []

    return collections.filter((x) => selectedValues.includes(x.id))
  }, [collections, selectedValues])

  return (
    <div className="link-collections">
      <div className="form-group">
        <label>Collections</label>
        <input
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
          placeholder="Search collections"
          className="form-control"
          type="text"
        />
        {searchResults.length === 0 ? null : (
          <div className="search-results">
            {loading ? (
              'Loading...'
            ) : (
              <CollectionItemCheckboxes
                uniquePrefix="coll-search-result"
                collections={searchResults}
                onChange={onChange}
                selectedValues={selectedValues}
              />
            )}
          </div>
        )}
      </div>
      <div className="selected-values">
        {loading ? (
          'Loading...'
        ) : (
          <CollectionItemCheckboxes
            uniquePrefix="coll-selected-val-"
            collections={selectedCollections}
            onChange={onChange}
            selectedValues={selectedValues}
          />
        )}
      </div>

      <CreateCollection className="new-coll-link" onSuccess={() => {}}>
        <div className="add-coll-icon">+</div>
        Add a collection
      </CreateCollection>

      <div className="desc">
        Add this product to a collection so it’s easier to find in your store.
      </div>
    </div>
  )
}

export default LinkCollections

require('react-styl')(`
  .link-collections
    border-radius: 10px
    border: solid 1px #cdd7e0
    background-color: #ffffff
    padding: 1.125rem

    .form-check
      margin-bottom: 0rem !important
      &:focus
        outline: none

    .form-group
      position: relative

      input
        border-bottom-right-radius: 0px
        border-bottom-left-radius: 0px

      .search-results
        display: none
        position: absolute
        z-index: 100
        background-color: #fff
        width: 100%
        border: 1px solid #80bdff
        border-radius: 5px
        border-top: 0
        border-top-right-radius: 0px
        border-top-left-radius: 0px
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25)
        padding: 1rem

      input:focus + .search-results, &:focus-within .search-results, .search-results:focus-within, .search-results:focus
        display: block

    .new-coll-link
      display: flex
      align-items: center
      color: #3b80ee
      cursor: pointer
      border: 0
      width: 100%
      padding: 0.5rem 0
      &:focus
        outline: none
      &:not(:first-child)
        border-top: 1px solid #cdd7e0
        margin-top: 1rem
      .add-coll-icon
        border: solid 1px #3b80ee
        border-radius: 50%
        height: 18px
        width: 18px
        display: flex
        align-items: center
        justify-content: center
        margin-right: 5px

    .desc
      color: #9faebd
      font-size: 0.875rem
`)