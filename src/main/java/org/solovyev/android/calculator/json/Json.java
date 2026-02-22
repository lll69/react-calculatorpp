package org.solovyev.android.calculator.json;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.annotation.Nonnull;

public final class Json {

    @Nonnull
    private static final String TAG = "Json";

    private Json() {
    }

    @Nonnull
    public static <T> List<T> fromJson(@Nonnull JSONArray array, @Nonnull Creator<T> creator) {
        final List<T> items = new ArrayList<>(array.length());
        for (int i = 0; i < array.length(); i++) {
            final JSONObject json = array.optJSONObject(i);
            if (json == null) {
                continue;
            }
            try {
                items.add(creator.create(json));
            } catch (JSONException e) {
                // Log.e(TAG, e.getMessage(), e);
            }
        }
        return items;
    }

    @Nonnull
    public static JSONArray toJson(@Nonnull List<? extends Jsonable> items) {
        final JSONArray array = new JSONArray();
        for (int i = 0; i < items.size(); i++) {
            final Jsonable item = items.get(i);
            try {
                array.put(i, item.toJson());
            } catch (JSONException e) {
                // Log.e(TAG, e.getMessage(), e);
            }
        }
        return array;
    }

    public interface Creator<T> {
        @Nonnull
        T create(@Nonnull JSONObject json) throws JSONException;
    }
}
