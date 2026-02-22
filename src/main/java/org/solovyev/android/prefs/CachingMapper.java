package org.solovyev.android.prefs;


import org.solovyev.common.text.Mapper;

import java.util.Objects;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

public final class CachingMapper<T> implements Mapper<T> {

    private static class CachedEntry<T> {
        @Nullable
        private String value;
        @Nullable
        private T object;
    }

    @Nonnull
    private final Mapper<T> mapper;
    @Nullable
    private CachedEntry<T> cachedEntry = null;

    private CachingMapper(@Nonnull Mapper<T> mapper) {
        this.mapper = mapper;
    }

    @Nonnull
    public static <T> Mapper<T> of(@Nonnull Mapper<T> mapper) {
        if (mapper.getClass().equals(CachingMapper.class)) {
            return mapper;
        }
        return new CachingMapper<>(mapper);
    }

    @Nullable
    @Override
    public synchronized T parseValue(@Nullable String value) throws IllegalArgumentException {
        if (cachedEntry == null) {
            cachedEntry = new CachedEntry<>();
        } else if (Objects.equals(value, cachedEntry.value)) {
            return cachedEntry.object;
        }
        cachedEntry.value = value;
        cachedEntry.object = mapper.parseValue(value);
        return cachedEntry.object;
    }

    @Nullable
    @Override
    public synchronized String formatValue(@Nullable T object) throws IllegalArgumentException {
        if (cachedEntry == null) {
            cachedEntry = new CachedEntry<>();
        } else if (Objects.equals(cachedEntry.object, object)) {
            return cachedEntry.value;
        }
        cachedEntry.object = object;
        cachedEntry.value = mapper.formatValue(object);
        return cachedEntry.value;
    }
}
