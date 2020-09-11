import { put, call, takeEvery } from 'redux-saga/effects'
import { GET_DATA } from '../constants/actions'
import { saveDataAction } from '../actions/data'
import { usersDataUrl } from '../server'

function* getData() {
    const json = yield call(() =>
        fetch(usersDataUrl)
            .then((response) => response.json())
            .then((myJson) => myJson)
    )

    yield put(saveDataAction(json))
}
export default function* rootSaga() {
    yield takeEvery(GET_DATA, getData)
}
