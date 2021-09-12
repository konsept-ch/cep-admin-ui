import { put, call, takeEvery } from 'redux-saga/effects'

import { GET_DATA } from '../constants/actions'
import { saveDataAction } from '../actions/data'
import { usersDataUrl, loadFromClaroline, otherParams } from '../server'

function* getData() {
    // eslint-disable-next-line no-console
    loadFromClaroline(console.info)

    const json = yield call(() =>
        fetch(usersDataUrl, otherParams)
            .then((response) => response.json())
            .then((myJson) => myJson)
    )

    yield put(saveDataAction(json))
}
export function* rootSaga() {
    yield takeEvery(GET_DATA, getData)
}
