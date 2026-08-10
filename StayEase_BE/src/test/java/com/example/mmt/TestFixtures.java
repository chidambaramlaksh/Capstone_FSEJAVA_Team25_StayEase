package com.example.mmt;

import org.springframework.test.util.ReflectionTestUtils;

/** Small test-only helper for assigning ids to JPA entities without a database. */
public final class TestFixtures {
    private TestFixtures() { }

    public static <T> T withId(T entity, Long id) {
        ReflectionTestUtils.setField(entity, "id", id);
        return entity;
    }
}
