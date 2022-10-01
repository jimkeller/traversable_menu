import {jest, describe, expect, test, beforeEach, afterEach} from '@jest/globals'
import {test_instance} from '../../test/setup'
import ActiveTrail from '../ActiveTrail'

describe('Active Trail', () => {
  
  let location: Location
  let mockedLocation: Location

  beforeEach(() => {

    jest.spyOn(window, "location", "get").mockRestore()
    location = window.location
    
    mockedLocation = {
      ...location,
      href: "https://example.com/relative-path",
      pathname: "/relative-path"
    }    

    jest.spyOn(window, 'location', 'get').mockReturnValue(mockedLocation)

  })

  test('Default active URLs include current relative pathname', () => {

    const active_urls = ActiveTrail.activeURLsDefault(test_instance.state)

    expect(active_urls).toContain('/relative-path')
  })

  test('Default active URLs include current href', () => {

    const active_urls = ActiveTrail.activeURLsDefault(test_instance.state)

    expect(active_urls).toContain('https://example.com/relative-path')
  })


  test('Default active URLs include current href without query string', () => {

    jest.spyOn(window, "location", "get").mockRestore()
    location = window.location
    
    mockedLocation = {
      ...location,
      href: "https://example.com/relative-path?something",
      pathname: "/relative-path"
    }    

    jest.spyOn(window, 'location', 'get').mockReturnValue(mockedLocation)

    const active_urls = ActiveTrail.activeURLsDefault(test_instance.state)

    expect(active_urls).toContain('https://example.com/relative-path')
  })

  test('Default active URLs include current href without query string or hashtag', () => {

    jest.spyOn(window, "location", "get").mockRestore()
    location = window.location
    
    mockedLocation = {
      ...location,
      href: "https://example.com/relative-path?something#hashtag",
      pathname: "/relative-path"
    }    

    jest.spyOn(window, 'location', 'get').mockReturnValue(mockedLocation)

    const active_urls = ActiveTrail.activeURLsDefault(test_instance.state)

    expect(active_urls).toContain('https://example.com/relative-path')
  })

})